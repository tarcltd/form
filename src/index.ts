import { z } from "zod";
export * from "./reform";
export { deep } from "./deep";
import type {
  FormReturnType,
  Schema,
  SchemaUiContentful,
  SchemaField,
  SchemaUi,
  SchemaReturnType,
  SchemaString,
  SchemaTuple,
  SchemaObject,
} from "./types";
export type * from "./types";

function generateSchema(
  schema: Schema | SchemaField | SchemaUiContentful | SchemaUi,
  key?: string,
  required?: string[]
): SchemaReturnType {
  let _schema: SchemaReturnType = undefined;
  let _name: string | undefined = (schema as SchemaString).name ?? "This value";

  if (schema.type === "object") {
    /* biome-ignore lint/suspicious/noExplicitAny: */
    const shape: Record<string, any> = {};

    if (typeof schema.properties === "object") {
      for (const prop in schema.properties) {
        const subschema = generateSchema(
          schema.properties[prop],
          prop,
          schema.required
        );

        if (typeof subschema === "undefined") {
          continue;
        }

        shape[prop] = subschema;
      }
    }

    _name = (schema as SchemaObject).name ?? (schema as Schema).title ?? "Form";

    _schema =
      typeof schema.patternProperties === "object"
        ? (z
            .record(z.string(), z.any(), {
              invalid_type_error: `${_name} must be an object.`,
              required_error: `${_name} is required.`,
            })
            .pipe(
              z.custom((value) => {
                if (
                  !z
                    .object(shape, {
                      invalid_type_error: `${_name} must be an object.`,
                      required_error: `${_name} is required.`,
                    })
                    .safeParse(value).success
                ) {
                  return false;
                }

                let pass = true;

                for (const prop in value) {
                  if (schema.properties && prop in schema.properties) {
                    continue;
                  }

                  const patternDef = Object.keys(schema.patternProperties).find(
                    (key) => new RegExp(key).test(prop)
                  );

                  if (patternDef) {
                    const subschema = generateSchema(
                      schema.patternProperties[patternDef],
                      prop,
                      schema.required
                    );

                    if (typeof subschema === "undefined") {
                      continue;
                    }

                    pass = subschema.safeParse(value[prop]).success;
                  }
                }

                return pass;
              })
              /* biome-ignore lint/suspicious/noExplicitAny: */
            ) as unknown as z.ZodObject<Record<string, any>>)
        : z.object(shape, {
            invalid_type_error: `${_name} must be an object.`,
            required_error: `${_name} is required.`,
          });

    if (
      typeof schema.if === "object" &&
      typeof schema.if.properties === "object" &&
      typeof schema.then === "object"
    ) {
      const ifSchema = generateSchema({
        ...schema.if,
        type: "object",
        required: Object.keys(schema.if.properties),
      } as SchemaObject);
      const thenSchema = generateSchema({
        ...schema.then,
        type: "object",
      } as SchemaObject);
      const elseSchema =
        typeof schema.else === "object"
          ? generateSchema({
              ...schema.else,
              type: "object",
            } as SchemaObject)
          : undefined;

      _schema = _schema.passthrough().pipe(
        z.custom(
          (value) => {
            if (typeof schema.attrs === "object") {
              delete schema.attrs.condition;

              if (Object.keys(schema.attrs).length === 0) {
                delete schema.attrs;
              }
            }

            if (
              /* biome-ignore lint/suspicious/noExplicitAny: */
              (ifSchema as z.ZodObject<Record<string, any>>).safeParse(value)
                .success
            ) {
              schema.attrs = {
                ...schema.attrs,
                condition: schema.then,
              };

              /* biome-ignore lint/suspicious/noExplicitAny: */
              return (thenSchema as z.ZodObject<Record<string, any>>).safeParse(
                value
              ).success;
            }

            if (elseSchema) {
              schema.attrs = {
                ...schema.attrs,
                condition: schema.else,
              };

              return elseSchema.safeParse(value).success;
            }

            return true;
          },
          {
            message: `${_name} is missing required information.`,
          }
        )
        /* biome-ignore lint/suspicious/noExplicitAny: */
      ) as unknown as z.ZodObject<Record<string, any>>;
    }
  } else if (
    schema.type === "string" &&
    (schema.format === "date" || schema.format === "date-time")
  ) {
    if (schema.format === "date-time") {
      _schema = z.string().datetime(`${_name} must be a valid date-time.`);
    }

    _schema = (_schema ?? z.string()).pipe(
      z.custom((value) => {
        let dateSchema = z.coerce.date({
          invalid_type_error: `${_name} must be a valid ${schema.format}.`,
          required_error: `${_name} is required.`,
        });

        if (typeof schema.minimum === "string") {
          dateSchema = dateSchema.min(new Date(schema.minimum), {
            message: `${_name} must not be before ${schema.minimum}.`,
          });
        } else if (
          Array.isArray(schema.minimum) &&
          schema.minimum.length === 2
        ) {
          if (schema.minimum[0] === "(") {
            dateSchema = dateSchema.pipe(
              z.custom(
                (value) =>
                  new Date(value) >=
                  new Date((schema.minimum as [string, string])[1]),
                {
                  message: `${_name} must be after ${schema.minimum[1]}.`,
                }
              )
            ) as unknown as z.ZodDate;
          } else if (schema.minimum[0] === "[") {
            dateSchema = dateSchema.min(new Date(schema.minimum[1]), {
              message: `${_name} must not be before ${schema.minimum}.`,
            });
          }
        } else if (typeof schema.exclusiveMinimum === "string") {
          dateSchema = dateSchema.pipe(
            z.custom(
              (value) =>
                new Date(value) >= new Date(schema.exclusiveMinimum as string),
              {
                message: `${_name} must be after ${schema.exclusiveMinimum}.`,
              }
            )
          ) as unknown as z.ZodDate;
        }

        if (typeof schema.maximum === "string") {
          dateSchema = dateSchema.max(new Date(schema.maximum), {
            message: `${_name} must not be after ${schema.maximum}.`,
          });
        } else if (
          Array.isArray(schema.maximum) &&
          schema.maximum.length === 2
        ) {
          if (schema.maximum[0] === ")") {
            dateSchema = dateSchema.pipe(
              z.custom(
                (value) =>
                  new Date(value) <=
                  new Date((schema.maximum as [string, string])[1]),
                {
                  message: `${_name} must be before ${schema.maximum[1]}.`,
                }
              )
            ) as unknown as z.ZodDate;
          } else if (schema.maximum[0] === "]") {
            dateSchema = dateSchema.max(new Date(schema.maximum[1]), {
              message: `${_name} must not be after ${schema.maximum}.`,
            });
          }
        } else if (typeof schema.exclusiveMaximum === "string") {
          dateSchema = dateSchema.pipe(
            z.custom(
              (value) =>
                new Date(value) <= new Date(schema.exclusiveMaximum as string),
              {
                message: `${_name} must be before ${schema.exclusiveMaximum}.`,
              }
            )
          ) as unknown as z.ZodDate;
        }

        return dateSchema.safeParse(value).success;
      })
    ) as unknown as z.ZodDate;
  } else if (schema.type === "string") {
    _schema = z.string({
      invalid_type_error: `${_name} must be a string.`,
      required_error: `${_name} is required.`,
    });

    if (schema.format === "uuid") {
      _schema = _schema.uuid({
        message: `${_name} must be a valid UUID.`,
      });
    } else if (schema.format === "url") {
      _schema = _schema.url({
        message: `${_name} must be a valid URL.`,
      });
    } else if (schema.format === "email") {
      _schema = _schema.email({
        message: `${_name} must be a valid email address.`,
      });
    } else if (schema.format === "ip") {
      _schema = _schema.ip({
        message: `${_name} must be a valid IP address.`,
      });
    } else if (schema.format === "ipv4") {
      _schema = _schema.ip({
        version: "v4",
        message: `${_name} must be a valid IPv4 address.`,
      });
    } else if (schema.format === "ipv6") {
      _schema = _schema.ip({
        version: "v6",
        message: `${_name} must be a valid IPv6 address.`,
      });
    } else if (schema.format === "time") {
      _schema = _schema.time({
        message: `${_name} must be a valid time.`,
      });
    } else if (schema.format === "base64") {
      _schema = _schema.base64({
        message: `${_name} must be a valid base64 string.`,
      });
    }

    if (typeof schema.minLength === "number") {
      _schema = _schema.min(schema.minLength, {
        message:
          `${_name} must be at least ` + `${schema.minLength} characters.`,
      });
    }

    if (typeof schema.maxLength === "number") {
      _schema = _schema.max(schema.maxLength, {
        message:
          `${_name} must be less than ` + `${schema.maxLength} characters.`,
      });
    }

    if (typeof schema.length === "number") {
      _schema = _schema.length(schema.length, {
        message: `${_name} must be ${schema.length} characters long.`,
      });
    }

    if (schema.pattern) {
      _schema = _schema.regex(new RegExp(schema.pattern), {
        message: `${_name} does not match required format.`,
      });
    }

    if (typeof schema.includes === "string") {
      _schema = _schema.includes(schema.includes, {
        message: `${_name} must include "${schema.includes}".`,
      });
    } else if (Array.isArray(schema.includes)) {
      for (const item of schema.includes) {
        _schema = _schema.includes(item, {
          message: `${_name} must include "${item}".`,
        });
      }
    }

    if (typeof schema.excludes === "string") {
      _schema = _schema.pipe(
        z.custom(
          (value) =>
            typeof value !== "string" ||
            !value.includes(schema.excludes as string),
          {
            message: `${_name} must not include "${schema.excludes}".`,
          }
        )
      ) as unknown as z.ZodString;
    } else if (Array.isArray(schema.excludes)) {
      for (const item of schema.excludes) {
        _schema = _schema.pipe(
          z.custom(
            (value) => typeof value !== "string" || !value.includes(item),
            {
              message: `${_name} must not include "${schema.excludes}".`,
            }
          )
        ) as unknown as z.ZodString;
      }
    }

    if (schema.startsWith) {
      _schema = _schema.startsWith(schema.startsWith, {
        message: `${_name} must start with "${schema.startsWith}".`,
      });
    }

    if (schema.endsWith) {
      _schema = _schema.endsWith(schema.endsWith, {
        message: `${_name} must end with "${schema.endsWith}".`,
      });
    }

    if (Array.isArray(schema.enum) && schema.enum.length > 0) {
      const enumValues: ReadonlyArray<string> = [...schema.enum];

      _schema = z.enum(enumValues as [string, ...string[]], {
        invalid_type_error: `${_name} is not a valid option.`,
        required_error: `${_name} is not a valid option.`,
        message: `${_name} is not a valid option.`,
      });
    }

    if (
      Array.isArray(schema.exclusiveEnum) &&
      schema.exclusiveEnum.length > 0
    ) {
      const enumValues: ReadonlyArray<string> = [...schema.exclusiveEnum];

      _schema = _schema.pipe(
        z.custom((value) => !enumValues.includes(value), {
          message: `${_name} is not a valid option.`,
        })
      ) as unknown as z.ZodString;
    }
  } else if (schema.type === "number" || schema.type === "integer") {
    if (schema.type === "integer") {
      _schema = z
        .number({
          invalid_type_error: `${_name} must be an integer.`,
          required_error: `${_name} is required.`,
        })
        .int();
    } else {
      _schema = z.number({
        invalid_type_error: `${_name} must be a number.`,
        required_error: `${_name} is required.`,
      });
    }

    if (typeof schema.minimum === "number") {
      _schema = _schema.min(schema.minimum, {
        message: `${_name} must be at least ` + `${schema.minimum}.`,
      });
    } else if (Array.isArray(schema.minimum) && schema.minimum.length === 2) {
      if (schema.minimum[0] === "(") {
        _schema = _schema.gt(schema.minimum[1], {
          message: `${_name} must be greater than ` + `${schema.minimum[1]}.`,
        });
      } else if (schema.minimum[0] === "[") {
        _schema = _schema.gte(schema.minimum[1], {
          message:
            `${_name} must be greater than or equal to ` +
            `${schema.minimum[1]}.`,
        });
      }
    } else if (typeof schema.exclusiveMinimum === "number") {
      _schema = _schema.gt(schema.exclusiveMinimum, {
        message: `${_name} must be greater than ${schema.exclusiveMinimum}.`,
      });
    }

    if (typeof schema.maximum === "number") {
      _schema = _schema.max(schema.maximum, {
        message: `${_name} must be less than ` + `${schema.maximum}.`,
      });
    } else if (Array.isArray(schema.maximum) && schema.maximum.length === 2) {
      if (schema.maximum[0] === ")") {
        _schema = _schema.lt(schema.maximum[1], {
          message: `${_name} must be less than ` + `${schema.maximum[1]}.`,
        });
      } else if (schema.maximum[0] === "]") {
        _schema = _schema.lte(schema.maximum[1], {
          message:
            `${_name} must be less than or equal to ` + `${schema.maximum[1]}.`,
        });
      }
    } else if (typeof schema.exclusiveMaximum === "number") {
      _schema = _schema.lt(schema.exclusiveMaximum, {
        message: `${_name} must be less than ${schema.exclusiveMaximum}.`,
      });
    }

    if (typeof schema.multipleOf === "number") {
      _schema = _schema.multipleOf(schema.multipleOf, {
        message: `${_name} must be a multiple of ` + `${schema.multipleOf}.`,
      });
    }
  } else if (schema.type === "boolean") {
    _schema = z.boolean({
      invalid_type_error: `${_name} must be true or false.`,
      required_error: `${_name} is required.`,
    });
  } else if (schema.type === "array") {
    const subschema =
      typeof schema.items === "object"
        ? generateSchema(schema.items as SchemaField)
        : z.any();

    /* biome-ignore lint/suspicious/noExplicitAny: */
    _schema = z.array(subschema as z.ZodType<any>, {
      required_error: `${_name} is required.`,
    });

    if (typeof schema.minItems === "number") {
      _schema = _schema.min(schema.minItems, {
        message: `${_name} must have at least ${schema.minItems} items.`,
      });
    }

    if (typeof schema.maxItems === "number") {
      _schema = _schema.max(schema.maxItems, {
        message: `${_name} must have less than ${schema.maxItems} items.`,
      });
    }

    if (typeof schema.length === "number") {
      _schema = _schema.length(schema.length, {
        message: `${_name} must have ${schema.length} items.`,
      });
    }

    if (schema.nonempty === true) {
      _schema = _schema.nonempty(`${_name} must not be empty.`);
    }

    if (schema.uniqueItems === true) {
      _schema = _schema.pipe(
        z.custom(
          (value) => {
            const unique = new Set(value);

            return value.length === unique.size;
          },
          {
            message: `${_name} must be unique.`,
          }
        )
        /* biome-ignore lint/suspicious/noExplicitAny: */
      ) as unknown as z.ZodArray<any, "many">;
    }
  } else if (schema.type === "tuple") {
    const subschema = (
      Array.isArray(schema.items)
        ? schema.items.map((item) => generateSchema(item as SchemaField))
        : []
    ) as
      | []
      /* biome-ignore lint/suspicious/noExplicitAny: */
      | [z.ZodType<any>, ...z.ZodType<any>[]];

    if (
      subschema.length &&
      !subschema.some((item) => typeof item === "undefined")
    ) {
      _schema = z.tuple(subschema, {
        required_error: `${_name} is required.`,
        message: `${_name} is not valid.`,
      });
    } else if (Array.isArray(schema.anyOf)) {
      _schema = z.custom(
        (value) => {
          for (const anyOf of (schema as SchemaTuple).anyOf as SchemaTuple[]) {
            const _subschemaDef = {
              ...anyOf,
              type: (schema as SchemaTuple).type,
              name: (schema as SchemaTuple).name,
            };

            if (generateSchema(_subschemaDef)?.safeParse(value).success) {
              return true;
            }
          }

          return false;
        },
        {
          message: `${_name} is not valid.`,
        }
      ) as unknown as z.ZodTuple;
    } else if (Array.isArray(schema.oneOf)) {
      _schema = z.custom(
        (value) => {
          let matches = false;

          for (const oneOf of (schema as SchemaTuple).oneOf as SchemaTuple[]) {
            const _subschemaDef = {
              ...oneOf,
              type: (schema as SchemaTuple).type,
              name: (schema as SchemaTuple).name,
            };

            if (generateSchema(_subschemaDef)?.safeParse(value).success) {
              if (matches) {
                return false;
              }

              matches = true;
            }
          }

          return matches;
        },
        {
          message: `${_name} is not valid.`,
        }
      ) as unknown as z.ZodTuple;
    }
  } else if (schema.type === "null") {
    _schema = z.null({
      invalid_type_error: `${_name} must be null.`,
      required_error: `${_name} is required.`,
    });
  }

  if (!_schema) {
    return;
  }

  if (
    typeof key === "string" &&
    Array.isArray(required) &&
    !required.includes(key)
  ) {
    _schema = _schema.optional();
  }

  if ((schema as Schema).nullable === true) {
    _schema = _schema.nullable();
  }

  if (schema.type !== "tuple") {
    // The schema here may not be a `SchemaString`, but this escapes a bunch of
    // `any` type overrides
    if (Array.isArray((schema as SchemaString).allOf)) {
      _schema = _schema.pipe(
        z.custom(
          (value) => {
            for (const allOf of (schema as SchemaString)
              .allOf as SchemaString[]) {
              const _subschemaDef = {
                ...allOf,
                type: (schema as SchemaString).type,
                name: (schema as SchemaString).name,
              };

              if (typeof (schema as SchemaString).format === "string") {
                _subschemaDef.format = (schema as SchemaString).format;
              }

              if (!generateSchema(_subschemaDef)?.safeParse(value).success) {
                return false;
              }
            }

            return true;
          },
          {
            message: `${_name} is not valid.`,
          }
        )
      ) as unknown as z.ZodString;
    } else if (Array.isArray((schema as SchemaString).anyOf)) {
      _schema = _schema.pipe(
        z.custom(
          (value) => {
            for (const anyOf of (schema as SchemaString)
              .anyOf as SchemaString[]) {
              const _subschemaDef = {
                ...anyOf,
                type: (schema as SchemaString).type,
                name: (schema as SchemaString).name,
              };

              if (typeof (schema as SchemaString).format === "string") {
                _subschemaDef.format = (schema as SchemaString).format;
              }

              if (generateSchema(_subschemaDef)?.safeParse(value).success) {
                return true;
              }
            }

            return false;
          },
          {
            message: `${_name} is not valid.`,
          }
        )
      ) as unknown as z.ZodString;
    } else if (Array.isArray((schema as SchemaString).oneOf)) {
      _schema = _schema.pipe(
        z.custom(
          (value) => {
            let matches = false;

            for (const oneOf of (schema as SchemaString)
              .oneOf as SchemaString[]) {
              const _subschemaDef = {
                ...oneOf,
                type: (schema as SchemaString).type,
                name: (schema as SchemaString).name,
              };

              if (typeof (schema as SchemaString).format === "string") {
                _subschemaDef.format = (schema as SchemaString).format;
              }

              if (generateSchema(_subschemaDef)?.safeParse(value).success) {
                if (matches) {
                  return false;
                }

                matches = true;
              }
            }

            return matches;
          },
          {
            message: `${_name} is not valid.`,
          }
        )
      ) as unknown as z.ZodString;
    }
  }

  return _schema;
}

/**
 * Generate a form object with Zod validation from a schema definition.
 *
 * @param schema - A schema definition.
 * @param state - The form state.
 * @param options - Options for the form.
 *   - `defaults`: The default values for the form.
 *   - `impl`: The implementation object for the form.
 * @returns An object with the following properties:
 * - `input`: The form schema definition.
 * - `state`: The form state.
 * - `schema`: The parsed `ZodObject` schema.
 * - `reset`: Reset the form to its default values.
 */
/* biome-ignore lint/suspicious/noExplicitAny: */
export function createForm<T = Record<string, any>>(
  schema: Schema,
  /* biome-ignore lint/suspicious/noExplicitAny: */
  state?: any,
  options: Partial<{
    /* biome-ignore lint/suspicious/noExplicitAny: */
    defaults: Record<string, any>;
    impl: T;
  }> = {
    defaults: {},
    impl: {} as T,
  }
): FormReturnType & T {
  /* biome-ignore lint/style/noParameterAssign: */
  state ??= {};

  const _options = {
    defaults: {},
    impl: {},
    ...options,
  };

  function reset() {
    for (const key in state) {
      if (typeof _options.defaults[key] === "undefined") {
        delete state[key];
      }
    }

    for (const key in schema.properties) {
      if (typeof schema.properties[key].attrs?.default !== "undefined") {
        state[key] = schema.properties[key].attrs?.default;
      }
    }

    for (const key in _options.defaults) {
      state[key] = _options.defaults[key];
    }
  }

  reset();

  return {
    ..._options.impl,
    /**
     * The input schema definition.
     */
    input: schema,
    /**
     * The form state.
     */
    state,
    /**
     * A Zod schema for the input.
     */
    schema: generateSchema(schema),
    /**
     * Reset the form to its default values.
     */
    reset,
  } as FormReturnType & T;
}

export default createForm;

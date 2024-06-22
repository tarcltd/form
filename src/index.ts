import { z } from "zod";
export * from "./reform";
export { deep } from "./deep";
import type {
  FormReturnType,
  Schema,
  SchemaContentful,
  SchemaField,
  SchemaHr,
  SchemaReturnType,
} from "./types";
export type * from "./types";

function generateSchema(
  schema: Schema | SchemaField | SchemaContentful | SchemaHr,
  key?: string,
  required?: string[]
): SchemaReturnType {
  let _schema: SchemaReturnType = undefined;

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

    const computedName = schema.name ?? (schema as Schema).title ?? "Form";

    _schema =
      typeof schema.patternProperties === "object"
        ? (z
            .record(z.string(), z.any(), {
              invalid_type_error: `${computedName} must be an object.`,
              required_error: `${computedName} is required.`,
            })
            .pipe(
              z.custom((value) => {
                if (
                  !z
                    .object(shape, {
                      invalid_type_error: `${computedName} must be an object.`,
                      required_error: `${computedName} is required.`,
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
            invalid_type_error: `${computedName} must be an object.`,
            required_error: `${computedName} is required.`,
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
      });
      const thenSchema = generateSchema({
        ...schema.then,
        type: "object",
      });

      const elseSchema =
        typeof schema.else === "object"
          ? generateSchema({
              ...schema.else,
              type: "object",
            })
          : undefined;

      _schema = _schema.passthrough().pipe(
        z.custom(
          (value) => {
            if (
              (ifSchema as z.ZodObject<Record<string, any>>).safeParse(value)
                .success
            ) {
              return (thenSchema as z.ZodObject<Record<string, any>>).safeParse(
                value
              ).success;
            }

            if (elseSchema) {
              return elseSchema.safeParse(value).success;
            }

            return true;
          },
          {
            message: `${computedName} is missing required information.`,
          }
        )
      ) as unknown as z.ZodObject<Record<string, any>>;
    }
  } else if (schema.type === "string" && schema.format === "date") {
    _schema = z.coerce.date({
      invalid_type_error: `${schema.name} must be a valid date.`,
      required_error: `${schema.name} is required.`,
    });

    if (typeof schema.minimum === "string") {
      _schema = _schema.min(new Date(schema.minimum), {
        message: `${schema.name} must be at least ${schema.minimum}.`,
      });
    }

    if (typeof schema.maximum === "string") {
      _schema = _schema.max(new Date(schema.maximum), {
        message: `${schema.name} must be less than ${schema.maximum}.`,
      });
    }
  } else if (schema.type === "string" && schema.format === "date-time") {
    _schema = z
      .string({
        invalid_type_error: `${schema.name} must be a string.`,
        required_error: `${schema.name} is required.`,
      })
      .datetime({
        message: `${schema.name} must be a valid date-time.`,
      });

    if (typeof schema.minimum === "string") {
      _schema = _schema.pipe(
        z.custom(
          (value) => new Date(value) >= new Date(schema.minimum as string),
          {
            message: `${schema.name} must be at least ${schema.minimum}.`,
          }
        )
      ) as unknown as z.ZodString;
    }

    if (typeof schema.maximum === "string") {
      _schema = _schema.pipe(
        z.custom(
          (value) => new Date(value) <= new Date(schema.maximum as string),
          {
            message: `${schema.name} must be less than ${schema.maximum}.`,
          }
        )
      ) as unknown as z.ZodString;
    }
  } else if (schema.type === "string") {
    _schema = z.string({
      invalid_type_error: `${schema.name} must be a string.`,
      required_error: `${schema.name} is required.`,
    });

    if (schema.format === "uuid") {
      _schema = _schema.uuid({
        message: `${schema.name} must be a valid UUID.`,
      });
    } else if (schema.format === "url") {
      _schema = _schema.url({
        message: `${schema.name} must be a valid URL.`,
      });
    } else if (schema.format === "email") {
      _schema = _schema.email({
        message: `${schema.name} must be a valid email address.`,
      });
    } else if (schema.format === "ip") {
      _schema = _schema.ip({
        message: `${schema.name} must be a valid IP address.`,
      });
    } else if (schema.format === "ipv4") {
      _schema = _schema.ip({
        version: "v4",
        message: `${schema.name} must be a valid IPv4 address.`,
      });
    } else if (schema.format === "ipv6") {
      _schema = _schema.ip({
        version: "v6",
        message: `${schema.name} must be a valid IPv6 address.`,
      });
    } else if (schema.format === "time") {
      _schema = _schema.time({
        message: `${schema.name} must be a valid time.`,
      });
    } else if (schema.format === "base64") {
      _schema = _schema.base64({
        message: `${schema.name} must be a valid base64 string.`,
      });
    }

    if (typeof schema.minLength === "number") {
      _schema = _schema.min(schema.minLength, {
        message:
          `${schema.name} must be at least ` +
          `${schema.minLength} characters.`,
      });
    }

    if (typeof schema.maxLength === "number") {
      _schema = _schema.max(schema.maxLength, {
        message:
          `${schema.name} must be less than ` +
          `${schema.maxLength} characters.`,
      });
    }

    if (typeof schema.length === "number") {
      _schema = _schema.length(schema.length, {
        message: `${schema.name} must be ${schema.length} characters long.`,
      });
    }

    if (schema.pattern) {
      _schema = _schema.regex(new RegExp(schema.pattern), {
        message: `${schema.name} does not match required format.`,
      });
    }

    if (typeof schema.includes === "string") {
      _schema = _schema.includes(schema.includes, {
        message: `${schema.name} must include "${schema.includes}".`,
      });
    } else if (Array.isArray(schema.includes)) {
      for (const item of schema.includes) {
        _schema = _schema.includes(item, {
          message: `${schema.name} must include "${item}".`,
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
            message: `${schema.name} must not include "${schema.excludes}".`,
          }
        )
      ) as unknown as z.ZodString;
    } else if (Array.isArray(schema.excludes)) {
      for (const item of schema.excludes) {
        _schema = _schema.pipe(
          z.custom(
            (value) => typeof value !== "string" || !value.includes(item),
            {
              message: `${schema.name} must not include "${schema.excludes}".`,
            }
          )
        ) as unknown as z.ZodString;
      }
    }

    if (schema.startsWith) {
      _schema = _schema.startsWith(schema.startsWith, {
        message: `${schema.name} must start with "${schema.startsWith}".`,
      });
    }

    if (schema.endsWith) {
      _schema = _schema.endsWith(schema.endsWith, {
        message: `${schema.name} must end with "${schema.endsWith}".`,
      });
    }

    if (Array.isArray(schema.enum) && schema.enum.length > 0) {
      const enumValues: ReadonlyArray<string> = [...schema.enum];

      _schema = z.enum(enumValues as [string, ...string[]], {
        invalid_type_error: `${schema.name} is not a valid option.`,
        required_error: `${schema.name} is not a valid option.`,
        message: `${schema.name} is not a valid option.`,
      });
    }

    if (
      Array.isArray(schema.exclusiveEnum) &&
      schema.exclusiveEnum.length > 0
    ) {
      const enumValues: ReadonlyArray<string> = [...schema.exclusiveEnum];

      _schema = _schema.pipe(
        z.custom((value) => !enumValues.includes(value), {
          message: `${schema.name} is not a valid option.`,
        })
      ) as unknown as z.ZodString;
    }
  } else if (schema.type === "number" || schema.type === "integer") {
    if (schema.type === "integer") {
      _schema = z
        .number({
          invalid_type_error: `${schema.name} must be an integer.`,
          required_error: `${schema.name} is required.`,
        })
        .int();
    } else {
      _schema = z.number({
        invalid_type_error: `${schema.name} must be a number.`,
        required_error: `${schema.name} is required.`,
      });
    }

    if (typeof schema.minimum === "number") {
      _schema = _schema.min(schema.minimum, {
        message: `${schema.name} must be at least ` + `${schema.minimum}.`,
      });
    } else if (Array.isArray(schema.minimum) && schema.minimum.length === 2) {
      if (schema.minimum[0] === "(") {
        _schema = _schema.gt(schema.minimum[1], {
          message:
            `${schema.name} must be greater than ` + `${schema.minimum[1]}.`,
        });
      } else if (schema.minimum[0] === "[") {
        _schema = _schema.gte(schema.minimum[1], {
          message:
            `${schema.name} must be greater than or equal to ` +
            `${schema.minimum[1]}.`,
        });
      }
    } else if (typeof schema.exclusiveMinimum === "number") {
      _schema = _schema.gt(schema.exclusiveMinimum, {
        message: `${schema.name} must be greater than ${schema.exclusiveMinimum}.`,
      });
    }

    if (typeof schema.maximum === "number") {
      _schema = _schema.max(schema.maximum, {
        message: `${schema.name} must be less than ` + `${schema.maximum}.`,
      });
    } else if (Array.isArray(schema.maximum) && schema.maximum.length === 2) {
      if (schema.maximum[0] === ")") {
        _schema = _schema.lt(schema.maximum[1], {
          message:
            `${schema.name} must be less than ` + `${schema.maximum[1]}.`,
        });
      } else if (schema.maximum[0] === "]") {
        _schema = _schema.lte(schema.maximum[1], {
          message:
            `${schema.name} must be less than or equal to ` +
            `${schema.maximum[1]}.`,
        });
      }
    } else if (typeof schema.exclusiveMaximum === "number") {
      _schema = _schema.lt(schema.exclusiveMaximum, {
        message: `${schema.name} must be less than ${schema.exclusiveMaximum}.`,
      });
    }

    if (typeof schema.multipleOf === "number") {
      _schema = _schema.multipleOf(schema.multipleOf, {
        message:
          `${schema.name} must be a multiple of ` + `${schema.multipleOf}.`,
      });
    }
  } else if (schema.type === "boolean") {
    _schema = z.boolean({
      invalid_type_error: `${schema.name} must be true or false.`,
      required_error: `${schema.name} is required.`,
    });
  } else if (schema.type === "array") {
    const subschema = generateSchema(schema.items);

    if (typeof subschema === "undefined") {
      return;
    }

    _schema = z.array(subschema, {
      required_error: `${schema.name} is required.`,
    });

    if (typeof schema.minItems === "number") {
      _schema = _schema.min(schema.minItems, {
        message: `${schema.name} must have at least ${schema.minItems} items.`,
      });
    }

    if (typeof schema.maxItems === "number") {
      _schema = _schema.max(schema.maxItems, {
        message: `${schema.name} must have less than ${schema.maxItems} items.`,
      });
    }

    if (typeof schema.length === "number") {
      _schema = _schema.length(schema.length, {
        message: `${schema.name} must have ${schema.length} items.`,
      });
    }

    if (schema.nonempty === true) {
      _schema = _schema.nonempty(`${schema.name} must not be empty.`);
    }

    if (schema.uniqueItems === true) {
      _schema = _schema.pipe(
        z.custom(
          (value) => {
            const unique = new Set(value);

            return value.length === unique.size;
          },
          {
            message: `${schema.name} must be unique.`,
          }
        )
        /* biome-ignore lint/suspicious/noExplicitAny: */
      ) as unknown as z.ZodArray<any, "many">;
    }
  } else if (schema.type === "tuple") {
    const subschema = schema.items.map((item) => generateSchema(item)) as
      | []
      /* biome-ignore lint/suspicious/noExplicitAny: */
      | [z.ZodType<any>, ...z.ZodType<any>[]];

    if (subschema.some((item) => typeof item === "undefined")) {
      return;
    }

    _schema = z.tuple(subschema, {
      required_error: `${schema.name} is required.`,
    });
  } else if (schema.type === "null") {
    _schema = z.null({
      invalid_type_error: `${schema.name} must be null.`,
      required_error: `${schema.name} is required.`,
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

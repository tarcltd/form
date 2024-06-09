import { z } from "zod";
export * from "./reform"
export { default as deep } from "./deep";

/**
 * A generator type used for narrowing. This is for internal use only.
 */
/* biome-ignore lint/suspicious/noExplicitAny: */
export type SchemaFieldType<T extends Record<string, any>> = {
  /**
   * The name of the field. This is used as the name by default.
   */
  name: string;
  /**
   * The description of the field.
   */
  description?: string;
  /**
   * A comment for the field.
   */
  $comment?: string;
  /**
   * Attributes for arbitrary functionality that may not be universally
   * supported. Functionality available in this library is limited to
   * `default`, which sets the default value of the field if another is not
   * provided.
   */
  /* biome-ignore lint/suspicious/noExplicitAny: */
  attrs?: Record<string, any>;
  /**
   * Whether the field is nullable.
   */
  nullable?: boolean;
} & T;

/**
 * A JSON form schema definition.
 */
/* biome-ignore lint/suspicious/noExplicitAny: */
export type Schema = Record<string, any> & {
  /**
   * The optional external JSON schema URL that this schema adheres to.
   */
  $schema?: string;
  /**
   * The optional unique identifier of the schema. Typically a URL.
   */
  $id?: string;
  /**
   * The optional title of the schema.
   */
  title?: string;
  /**
   * The optional description of the schema.
   */
  description?: string;
  /**
   * A comment for the schema.
   */
  $comment?: string;
  /**
   * The optional
   * {@link https://www.iso.org/iso-8601-date-and-time-format.html|ISO 8601}
   * publish date of the schema.
   */
  published_at?: string;
  /**
   * This must be `object`.
   */
  type: "object";
  /**
   * The properties of the object.
   */
  properties: Record<string, SchemaField>;
  /**
   * The required fields of the schema.
   */
  required: string[];
  /**
   * The optional metadata attached to the schema.
   */
  /* biome-ignore lint/suspicious/noExplicitAny: */
  metadata?: Record<string, any>;
};

/**
 * A form field definition.
 */
export type SchemaField =
  | SchemaFieldType<{
      /**
       * The type of the field.
       */
      type: "object";
      /**
       * The properties of the object.
       */
      properties?: Record<string, SchemaField>;
      /**
       * A definition of keys that match a pattern that should validate with a
       * specified `SchemaField` definition.
       *
       * @example
       *
       * ```ts
       * {
       *   patternProperties: {
       *     "^[0-9]{3}$": {
       *       type: "number",
       *       name: "Number",
       *     },
       *   },
       * }
       * ```
       */
      patternProperties?: Record<string, SchemaField>;
      /**
       * The required fields of the object. Non-required fields will be
       * validated but marked as optional.
       */
      required: string[];
    }>
  | SchemaFieldType<{
      /**
       * The type of the field.
       */
      type: "string";
      /**
       * If true, the field is nullable.
       */
      nullable?: boolean;
      /**
       * A set of valid values for the input.
       */
      /* biome-ignore lint/suspicious/noExplicitAny: */
      enum?: any[];
      /**
       * The minimum length of the input.
       */
      minLength?: number;
      /**
       * The maximum length of the input.
       */
      maxLength?: number;
      /**
       * The exact length of the input. This typically should not be used with
       * `minLength` and `maxLength`.
       */
      length?: number;
      /**
       * A regular expression to validate the input.
       */
      pattern?: string;
      /**
       * A specific format of the input.
       */
      format?:
        | "uuid"
        | "email"
        | "ip"
        | "ipv4"
        | "ipv6"
        | "url"
        | "date"
        | "date-time"
        | "time";
      /**
       * A string that the input should start with.
       */
      startsWith?: string;
      /**
       * A string that the input should end with.
       */
      endsWith?: string;
      /**
       * A string that should be included in the input.
       */
      includes?: string;
    }>
  | SchemaFieldType<{
      /**
       * The type of the field.
       */
      type: "number";
      /**
       * If true, the field is nullable.
       */
      nullable?: boolean;
      /**
       * The minimum value of the input. This is inclusive. Using a tuple to
       * specify the minimum is supported.
       *
       * @example
       *
       * Must be greater than 9.
       * ```ts
       * {
       *   minimum: ["(", 9];
       * }
       * ```
       */
      minimum?: number | ["(" | "[", number];
      /**
       * The maximum value of the input. This is inclusive by default. Using a
       * tuple to specify the maximum is supported.
       *
       * @example
       *
       * Must be less than 10.
       * ```ts
       * {
       *   maximum: [")", 10];
       * }
       * ```
       */
      maximum?: number | [")" | "]", number];
      /**
       * The exclusive minimum value of the input.
       */
      exclusiveMinimum?: number;
      /**
       * The exclusive maximum value of the input.
       */
      exclusiveMaximum?: number;
      /**
       * A number that the input should be a multiple of.
       */
      multipleOf?: number;
    }>
  | SchemaFieldType<{
      /**
       * The type of the field.
       */
      type: "integer";
      /**
       * If true, the field is nullable.
       */
      nullable?: boolean;
      /**
       * The minimum value of the input. This is inclusive. Using a tuple to
       * specify the minimum is supported.
       *
       * @example
       *
       * Must be greater than 9.
       * ```ts
       * {
       *   minimum: ["(", 9];
       * }
       * ```
       */
      minimum?: number | ["(" | "[", number];
      /**
       * The maximum value of the input. This is inclusive by default. Using a
       * tuple to specify the maximum is supported.
       *
       * @example
       *
       * Must be less than 10.
       * ```ts
       * {
       *   maximum: [")", 10];
       * }
       * ```
       */
      maximum?: number | [")" | "]", number];
      /**
       * The exclusive minimum value of the input.
       */
      exclusiveMinimum?: number;
      /**
       * The exclusive maximum value of the input.
       */
      exclusiveMaximum?: number;
      /**
       * A number that the input should be a multiple of.
       */
      multipleOf?: number;
    }>
  | SchemaFieldType<{
      /**
       * The type of the field.
       */
      type: "boolean";
      /**
       * If true, the field is nullable.
       */
      nullable?: boolean;
    }>
  | SchemaFieldType<{
      /**
       * The type of the field.
       */
      type: "array";
      /**
       * If true, the field is nullable.
       */
      nullable?: boolean;
      /**
       * The data type of the array items.
       */
      items: SchemaField;
      /**
       * The minimum number of items in the array.
       */
      minItems?: number;
      /**
       * The maximum number of items in the array.
       */
      maxItems?: number;
      /**
       * The number of items in the array. This typically should not be used
       * with `minItems` and `maxItems`.
       */
      length?: number;
      /**
       * If true, the array must have at least one item.
       */
      nonempty?: boolean;
      /**
       * If true, the array items must be unique.
       */
      uniqueItems?: boolean;
    }>
  | SchemaFieldType<{
      /**
       * The type of the field.
       */
      type: "tuple";
      /**
       * If true, the field is nullable.
       */
      nullable?: boolean;
      /**
       * The data type of the tuple items.
       */
      items: SchemaField[];
    }>
  | SchemaFieldType<{
      /**
       * The type of the field.
       */
      type: "null";
    }>
  | {
      /**
       * The type of the field.
       */
      type:
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6"
        | "p"
        | "info"
        | "warning"
        | "error"
        | "debug";
      /**
       * The content of the item.
       */
      content?: string;
      /**
       * Attributes for arbitrary functionality that may not be universally
       * supported. Functionality available in this library is limited to
       * `default`, which sets the default value of the field if another is not
       * provided.
       */
      /* biome-ignore lint/suspicious/noExplicitAny: */
      attrs?: Record<string, any>;
    }
  | {
      /**
       * The type of the field.
       */
      type: "hr";
      /**
       * Attributes for arbitrary functionality that may not be universally
       * supported. Functionality available in this library is limited to
       * `default`, which sets the default value of the field if another is not
       * provided.
       */
      /* biome-ignore lint/suspicious/noExplicitAny: */
      attrs?: Record<string, any>;
    };

/**
 * The return type of the schema. This is for internal use only.
 */
export type SchemaReturnType =
  /* biome-ignore lint/suspicious/noExplicitAny: */
  | z.ZodObject<Record<string, any>>
  /* biome-ignore lint/suspicious/noExplicitAny: */
  | z.ZodRecord<z.ZodString, any>
  | z.ZodString
  | z.ZodDate
  | z.ZodEnum<[string, ...string[]]>
  | z.ZodNumber
  | z.ZodBoolean
  /* biome-ignore lint/suspicious/noExplicitAny: */
  | z.ZodArray<any>
  /* biome-ignore lint/suspicious/noExplicitAny: */
  | z.ZodArray<any, "atleastone">
  /* biome-ignore lint/suspicious/noExplicitAny: */
  | z.ZodTuple<any>
  | z.ZodNull
  /* biome-ignore lint/suspicious/noExplicitAny: */
  | z.ZodNullable<any>
  /* biome-ignore lint/suspicious/noExplicitAny: */
  | z.ZodOptional<any>
  | undefined;

function generateSchema(
  schema: Schema | SchemaField,
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
  } else if (schema.type === "string" && schema.format === "date") {
    _schema = z.coerce.date({
      invalid_type_error: `${schema.name} must be a valid date.`,
      required_error: `${schema.name} is required.`,
    });
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
    } else if (schema.format === "date-time") {
      _schema = _schema.datetime({
        message: `${schema.name} must be a valid date-time.`,
      });
    } else if (schema.format === "time") {
      _schema = _schema.time({
        message: `${schema.name} must be a valid time.`,
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

    if (schema.includes) {
      _schema = _schema.includes(schema.includes, {
        message: `${schema.name} must include "${schema.includes}".`,
      });
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
      });
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
 * The required return for a form. This is for internal use only.
 */
export type FormReturnType = {
  input: Schema;
  /* biome-ignore lint/suspicious/noExplicitAny: */
  state: Record<string, any>;
  /* biome-ignore lint/suspicious/noExplicitAny: */
  schema: z.ZodObject<Record<string, any>>;
  reset: () => void;
};

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

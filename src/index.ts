import { type ZodObject, z } from "zod";

type AjVExtendedSchemaFieldType =
  | "header"
  | "subheader"
  | "hr"
  | "info"
  | "string"
  | "uuid"
  | "url"
  | "ip"
  | "email"
  | "date"
  | "datetime"
  | "time"
  | "number"
  | "boolean"
  | "array"
  | "tuple"
  | "null";

type AjvExtendedSchemaField =
  /* biome-ignore lint/suspicious/noExplicitAny: */
  | Record<string, any>
  | AjvExtendedSchemaObject
  | {
      /**
       * The name of the field. This is used as the name by default.
       */
      name: string;
      /**
       * The type of the field. Default is `string`.
       */
      type?: AjVExtendedSchemaFieldType;
      /**
       * The format of the tuple or array.
       */
      data?:
        | AjVExtendedSchemaFieldType
        | AjVExtendedSchemaFieldType[]
        | AjvExtendedSchemaObject
        | AjvExtendedSchemaObject[];
      /**
       * Whether the field is nullable.
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
       * The minimum value of the input.
       */
      min?: string | number | ["(" | "[", string | number];
      /**
       * The maximum value of the input.
       */
      max?: string | number | [")" | "]", string | number];
      /**
       * The length of the input.
       */
      length?: number;
      /**
       * A regular expression to validate the input.
       */
      pattern?: string;
      /**
       * A string that should be a part of the input.
       */
      includes?: string;
      /**
       * A string that should be at the start of the input.
       */
      startsWith?: string;
      /**
       * A string that should be at the end of the input.
       */
      endsWith?: string;
      /**
       * Attributes for UI passthrough.
       */
      /* biome-ignore lint/suspicious/noExplicitAny: */
      attrs?: Record<string, any>;
    };

/* biome-ignore lint/suspicious/noExplicitAny: */
type AjvExtendedSchemaObject = Record<string, any> & {
  /**
   * The type of the field.
   */
  type: "object";
  /**
   * The properties of the object.
   */
  properties?: Record<string, AjvExtendedSchemaField>;
  /**
   * The required fields of the schema.
   */
  required: string[];
};

export type AjvExtendedSchema = {
  /**
   * A form must be an object.
   */
  type: "object";
  /**
   * The properties of the schema.
   */
  properties: Record<string, AjvExtendedSchemaField>;
  /**
   * The required fields of the schema.
   */
  required: string[];
};

function generateSchema(schema: AjvExtendedSchema | AjvExtendedSchemaObject) {
  /* biome-ignore lint/suspicious/noExplicitAny: */
  const shape: Record<string, any> = {};

  if (schema.type === "object" && typeof schema.properties === "object") {
    for (const key in schema.properties) {
      if (
        schema.properties[key].type === "header" ||
        schema.properties[key].type === "subheader" ||
        schema.properties[key].type === "hr" ||
        schema.properties[key].type === "info"
      ) {
        continue;
      }

      if (schema.properties[key].type === "object") {
        shape[key] = generateSchema(
          schema.properties[key] as AjvExtendedSchemaObject
        );
      } else if (schema.properties[key].type === "array") {
        if (typeof schema.properties[key].data === "object") {
          shape[key] = z.array(
            generateSchema(
              schema.properties[key].data as AjvExtendedSchemaObject
            ),
            {
              required_error: `${schema.properties[key].name} is required.`,
            }
          );
        } else if (schema.properties[key].data === "number") {
          shape[key] = z.array(z.number(), {
            required_error: `${schema.properties[key].name} is required.`,
          });
        } else if (schema.properties[key].data === "boolean") {
          shape[key] = z.array(z.boolean(), {
            required_error: `${schema.properties[key].name} is required.`,
          });
        } else if (schema.properties[key].data === "null") {
          shape[key] = z.array(z.null(), {
            required_error: `${schema.properties[key].name} is required.`,
          });
        } else if (
          schema.properties[key].data === "date" ||
          schema.properties[key].data === "datetime"
        ) {
          shape[key] = z.array(z.date(), {
            required_error: `${schema.properties[key].name} is required.`,
          });
        } else {
          shape[key] = z.array(z.string(), {
            required_error: `${schema.properties[key].name} is required.`,
          });
        }

        if (schema.properties[key].minLength) {
          shape[key] = shape[key].min(schema.properties[key].minLength, {
            message:
              `${schema.properties[key].name} must have at least ` +
              `${schema.properties[key].minLength} items.`,
          });
        }

        if (schema.properties[key].maxLength) {
          shape[key] = shape[key].max(schema.properties[key].maxLength, {
            message:
              `${schema.properties[key].name} must have less than ` +
              `${schema.properties[key].minLength} items.`,
          });
        }
      } else if (schema.properties[key].type === "tuple") {
        console.warn("Tuple validation is not complete.");
        shape[key] = z.tuple([]);
      } else if (schema.properties[key].enum) {
        shape[key] = z.enum(schema.properties[key].enum, {
          invalid_type_error: `${
            schema.properties[key].name
          } must be one of the following: ${schema.properties[key].enum.join(
            ", "
          )}.`,
          required_error: `${
            schema.properties[key].name
          } must be one of the following: ${schema.properties[key].enum.join(
            ", "
          )}.`,
        });
      } else if (schema.properties[key].type === "number") {
        shape[key] = z.number({
          invalid_type_error: `${schema.properties[key].name} must be a number.`,
          required_error: `${schema.properties[key].name} is required.`,
        });

        if (typeof schema.properties[key].min === "number") {
          shape[key] = shape[key].min(schema.properties[key].min, {
            message:
              `${schema.properties[key].name} must be at least ` +
              `${schema.properties[key].min}.`,
          });
        }

        if (typeof schema.properties[key].max === "number") {
          shape[key] = shape[key].max(schema.properties[key].max, {
            message:
              `${schema.properties[key].name} must be less than ` +
              `${schema.properties[key].max}.`,
          });
        }
      } else if (schema.properties[key].type === "boolean") {
        shape[key] = z.boolean({
          invalid_type_error: `${schema.properties[key].name} must be a boolean.`,
          required_error: `${schema.properties[key].name} is required.`,
        });
      } else if (schema.properties[key].type === "null") {
        shape[key] = z.null({
          invalid_type_error: `${schema.properties[key].name} must be null.`,
          required_error: `${schema.properties[key].name} is required.`,
        });
      } else if (schema.properties[key].type === "date") {
        shape[key] = z.coerce.date({
          invalid_type_error: `${schema.properties[key].name} must be a date.`,
          required_error: `${schema.properties[key].name} is required.`,
        });
      } else if (schema.properties[key].type === "datetime") {
        shape[key] = z
          .string({
            invalid_type_error: `${schema.properties[key].name} must be a string.`,
            required_error: `${schema.properties[key].name} is required.`,
          })
          .datetime({
            message: `${schema.properties[key].name} must be a datetime.`,
          });
      } else if (schema.properties[key].type === "time") {
        shape[key] = (
          z.string({
            invalid_type_error: `${schema.properties[key].name} must be a string.`,
            required_error: `${schema.properties[key].name} is required.`,
            /* biome-ignore lint/suspicious/noExplicitAny: */
          }) as any
        ).time({
          message: `${schema.properties[key].name} must be a time.`,
        });
      } else {
        shape[key] = z.string({
          invalid_type_error: `${schema.properties[key].name} must be a string.`,
          required_error: `${schema.properties[key].name} is required.`,
        });

        if (schema.properties[key].type === "uuid") {
          shape[key] = shape[key].uuid({
            message: `${schema.properties[key].name} must be a valid UUID.`,
          });
        } else if (schema.properties[key].type === "url") {
          shape[key] = shape[key].url({
            message: `${schema.properties[key].name} must be a valid URL.`,
          });
        } else if (schema.properties[key].type === "email") {
          shape[key] = shape[key].email({
            message: `${schema.properties[key].name} must be a valid email address.`,
          });
        } else if (schema.properties[key].type === "ip") {
          shape[key] = shape[key].ip({
            message: `${schema.properties[key].name} must be a valid IP address.`,
          });
        }

        if (schema.properties[key].minLength) {
          shape[key] = shape[key].min(schema.properties[key].minLength, {
            message:
              `${schema.properties[key].name} must be at least ` +
              `${schema.properties[key].minLength} characters.`,
          });
        }

        if (schema.properties[key].maxLength) {
          shape[key] = shape[key].max(schema.properties[key].maxLength, {
            message:
              `${schema.properties[key].name} must be less than ` +
              `${schema.properties[key].maxLength} characters.`,
          });
        }

        if (schema.properties[key].length) {
          shape[key] = shape[key].length({
            message:
              `${schema.properties[key].name} must be ` +
              `${schema.properties[key].length} characters.`,
          });
        }

        if (schema.properties[key].pattern) {
          shape[key] = shape[key].regex(
            new RegExp(schema.properties[key].pattern),
            {
              message: `${schema.properties[key].name} does not match required format.`,
            }
          );
        }

        if (schema.properties[key].includes) {
          shape[key] = shape[key].includes(schema.properties[key].includes, {
            message:
              `${schema.properties[key].name} must include ` +
              `${schema.properties[key].includes}.`,
          });
        }

        if (schema.properties[key].startsWith) {
          shape[key] = shape[key].startsWith(
            schema.properties[key].startsWith,
            {
              message:
                `${schema.properties[key].name} must start with ` +
                `${schema.properties[key].startsWith}.`,
            }
          );
        }

        if (schema.properties[key].endsWith) {
          shape[key] = shape[key].endsWith(schema.properties[key].endsWith, {
            message:
              `${schema.properties[key].name} must end with ` +
              `${schema.properties[key].endsWith}.`,
          });
        }
      }

      if (!schema.required.includes(key)) {
        shape[key] = shape[key].optional();
      }

      if (schema.properties[key].nullable) {
        shape[key] = shape[key].nullable();
      }
    }
  }

  return z.object(shape);
}

/**
 * The required return for a form.
 */
export type FormReturnType = {
  input: AjvExtendedSchema;
  /* biome-ignore lint/suspicious/noExplicitAny: */
  state: Record<string, any>;
  /* biome-ignore lint/suspicious/noExplicitAny: */
  schema: ZodObject<Record<string, any>>;
  reset: () => void;
};

/**
 * From an extended AJV schema, generate a reactive form object with validation.
 *
 * @param schema - An extended AJV schema.
 * @param state - The form state.
 * @param defaults - The default values for the form.
 * @returns An object with the following properties:
 * - `input`: The extended Ajv schema input.
 * - `state`: The form state.
 * - `schema`: The Zod schema.
 * - `status`: The form validation status.
 * - `isValid`: Whether the form is currently valid.
 * - `reset`: Reset the form to its default values.
 */
/* biome-ignore lint/suspicious/noExplicitAny: */
export function form<T = Record<string, any>>(
  schema: AjvExtendedSchema,
  /* biome-ignore lint/suspicious/noExplicitAny: */
  state: any,
  options: Partial<{
    /* biome-ignore lint/suspicious/noExplicitAny: */
    defaults: Record<string, any>;
    impl: T;
  }> = {
    defaults: {},
    impl: {} as T,
  }
): FormReturnType & T {
  const _options = {
    defaults: {},
    impl: {},
    ...options,
  };

  /**
   * Reset the form to its default values.
   */
  function reset() {
    for (const key in state) {
      if (typeof _options.defaults[key] === "undefined") {
        delete state[key];
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
    reset,
  } as FormReturnType & T;
}

export default form;

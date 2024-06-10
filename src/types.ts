import type { z } from "zod";
import type createForm from ".";

/**
 * A generator type used for narrowing. This is for internal use only.
 */
/* biome-ignore lint/suspicious/noExplicitAny: */
export type SchemaFieldType<T extends Record<string, any>> = {
  /**
   * The name of the field.
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
 * An object field definition.
 */
export type SchemaObject = SchemaFieldType<{
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
}>;

/**
 * A string field definition.
 */
export type SchemaString = SchemaFieldType<{
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
}>;

export type SchemaNumber = SchemaFieldType<{
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
}>;

/**
 * An integer field definition.
 */
export type SchemaInteger = SchemaFieldType<{
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
}>;

/**
 * A boolean field definition.
 */
export type SchemaBoolean = SchemaFieldType<{
  /**
   * The type of the field.
   */
  type: "boolean";
  /**
   * If true, the field is nullable.
   */
  nullable?: boolean;
}>;

/**
 * An array field definition.
 */
export type SchemaArray = SchemaFieldType<{
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
}>;

/**
 * A tuple field definition.
 */
export type SchemaTuple = SchemaFieldType<{
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
}>;

/**
 * A null field definition.
 */
export type SchemaNull = SchemaFieldType<{
  /**
   * The type of the field.
   */
  type: "null";
}>;

/**
 * A form content definition.
 */
export type SchemaContentful = {
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
};

/**
 * A horizontal rule definition.
 */
export type SchemaHr = {
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
 * A form field definition.
 */
export type SchemaField =
  | SchemaObject
  | SchemaString
  | SchemaNumber
  | SchemaInteger
  | SchemaBoolean
  | SchemaArray
  | SchemaTuple
  | SchemaNull;

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
 * An object definition of handling for key output of reForm.
 */
export type ReFormKeyMapObject = {
  /**
   * The path to the key value.
   */
  path?: string;
  /**
   * Transform a key to a different key.
   *
   * @param key - The key to transform.
   * @returns The transformed key.
   */
  transform?: (
    value: string,
    context: {
      key: string;
      path: string;
      state: ReturnType<typeof createForm>["state"];
      input: ReturnType<typeof createForm>["input"];
    }
  ) => string;
};

/**
 * A mapping for key output of reForm.
 */
export type ReFormKeyMap = Partial<{
  [key: keyof ReturnType<typeof createForm>["state"]]:
    | string // an explicit path override
    | ReFormKeyMapObject
    | undefined;
}>;

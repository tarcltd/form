import type { z } from "zod";
import type createForm from ".";

/**
 * The base type for a field. This is for internal use only.
 */
/* biome-ignore lint/suspicious/noExplicitAny: */
export type SchemaFieldCommonType<T extends Record<string, any>> = {
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
 * A generator type used for narrowing. This is for internal use only.
 */
/* biome-ignore lint/suspicious/noExplicitAny: */
export type SchemaFieldType<T extends Record<string, any>> =
  SchemaFieldCommonType<
    {
      /**
       * The name of the field.
       */
      name: string;
    } & T
  >;

/**
 * A conditional definition for a `SchemaObject`.
 */
export type SchemaConditional = {
  /**
   * A conditional definition for the object.
   */
  if?: {
    /**
     * A definition of the form state condition. All fields in the `properties`
     * are implicitly required to result in a `true` state.
     */
    properties: Record<string, SchemaField>;
  };
  /**
   * A definition of the object if the condition is `true`.
   */
  then?: SchemaObject;
  /**
   * A definition of the object if the condition is `false`.
   */
  else?: SchemaObject;
};

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
  properties: Record<string, SchemaField | SchemaUiContentful | SchemaUi>;
  /**
   * The required fields of the schema.
   */
  required: string[];
  /**
   * The optional metadata attached to the schema.
   */
  /* biome-ignore lint/suspicious/noExplicitAny: */
  metadata?: Record<string, any>;
} & SchemaConditional;

/**
 * An object field definition.
 */
export type SchemaObject = SchemaFieldCommonType<{
  /**
   * The name of the field. This may be omitted if used in a conditional.
   */
  name?: string;
  /**
   * The type of the field.
   */
  type: "object";
  /**
   * The properties of the object.
   */
  properties?: Record<string, SchemaField | SchemaUiContentful | SchemaUi>;
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
}> &
  SchemaConditional;

/**
 * A string field definition.
 */
export type SchemaString = SchemaFieldType<{
  /**
   * The type of the field.
   */
  type: "string";
  /**
   * A set of valid values for the input.
   */
  enum?: string[];
  /**
   * A set of invalid values for the input.
   */
  exclusiveEnum?: string[];
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
   * A regular expression string to validate the input. See
   * {@link https://json-schema.org/understanding-json-schema/reference/regular_expressions|JSON Schema Regular Expressions}
   * for more information.
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
    | "time"
    | "base64";
  /**
   * A string that the input should start with.
   */
  startsWith?: string;
  /**
   * A string that the input should end with.
   */
  endsWith?: string;
  /**
   * A string or list of strings that should be included in the input.
   */
  includes?: string | string[];
  /**
   * A string or list of strings that should not be included in the input.
   */
  excludes?: string | string[];
  /**
   * To validate against `anyOf`, the given data must be valid against any (one
   * or more) of the given subschemas.
   */
  anyOf?: Omit<SchemaString, "type" | "name">[];
  /**
   * To validate against `allOf`, the given data must be valid against all of
   * the given subschemas.
   */
  allOf?: Omit<SchemaString, "type" | "name">[];
  /**
   * To validate against `oneOf`, the given data must be valid against exactly
   * one of the given subschemas.
   */
  oneOf?: Omit<SchemaString, "type" | "name">[];
}>;

/**
 * A date field definition.
 */
export type SchemaStringDate = SchemaFieldType<{
  /**
   * The type of the field.
   */
  type: "string";
  /**
   * The minimum date of the input. This is inclusive by default. Using a tuple
   * to specify the minimum is supported.
   *
   * @example
   *
   * Must be greater than August 1, 2024.
   * ```ts
   * {
   *   minimum: ["(", "2024-08-01";]
   * }
   * ```
   */
  minimum?: string | ["(" | "[", string];
  /**
   * The maximum date of the input. This is inclusive by default. Using a tuple
   * to specify the maximum is supported.
   *
   * @example
   *
   * Must be less than August 31, 2024.
   * ```ts
   * {
   *   maximum: [")", "2024-08-31";]
   * }
   * ```
   */
  maximum?: string | [")" | "]", string];
  /**
   * The exclusive minimum date of the input.
   */
  exclusiveMinimum?: string;
  /**
   * The exclusive maximum date of the input.
   */
  exclusiveMaximum?: string;
  /**
   * A specific format of the input.
   */
  format: "date";
  /**
   * To validate against `anyOf`, the given data must be valid against any (one
   * or more) of the given subschemas.
   */
  anyOf?: Omit<SchemaStringDate, "type" | "name" | "format">[];
  /**
   * To validate against `allOf`, the given data must be valid against all of
   * the given subschemas.
   */
  allOf?: Omit<SchemaStringDate, "type" | "name" | "format">[];
  /**
   * To validate against `oneOf`, the given data must be valid against exactly
   * one of the given subschemas.
   */
  oneOf?: Omit<SchemaStringDate, "type" | "name" | "format">[];
}>;

/**
 * A datetime field definition.
 */
export type SchemaStringDatetime = SchemaFieldType<{
  /**
   * The type of the field.
   */
  type: "string";
  /**
   * The minimum date or date-time of the input. This is inclusive by default.
   * Using a tuple to specify the minimum is supported.
   *
   * @example
   *
   * Must be greater than August 1, 2024.
   * ```ts
   * {
   *   minimum: ["(", "2024-08-01T12:00:00Z";]
   * }
   * ```
   */
  minimum?: string | ["(" | "[", string];
  /**
   * The maximum date or date-time of the input. This is inclusive by default.
   * Using a tuple to specify the maximum is supported.
   *
   * @example
   *
   * Must be less than August 31, 2024.
   * ```ts
   * {
   *   maximum: [")", "2024-08-31T12:00:00Z";]
   * }
   * ```
   */
  maximum?: string | [")" | "]", string];
  /**
   * The exclusive minimum date or date-time of the input.
   */
  exclusiveMinimum?: string;
  /**
   * The exclusive maximum date or date-time of the input.
   */
  exclusiveMaximum?: string;
  /**
   * A specific format of the input.
   */
  format: "date-time";
  /**
   * To validate against `anyOf`, the given data must be valid against any (one
   * or more) of the given subschemas.
   */
  anyOf?: Omit<SchemaStringDatetime, "type" | "name" | "format">[];
  /**
   * To validate against `allOf`, the given data must be valid against all of
   * the given subschemas.
   */
  allOf?: Omit<SchemaStringDatetime, "type" | "name" | "format">[];
  /**
   * To validate against `oneOf`, the given data must be valid against exactly
   * one of the given subschemas.
   */
  oneOf?: Omit<SchemaStringDatetime, "type" | "name" | "format">[];
}>;

export type SchemaNumber = SchemaFieldType<{
  /**
   * The type of the field.
   */
  type: "number";
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
  /**
   * To validate against `anyOf`, the given data must be valid against any (one
   * or more) of the given subschemas.
   */
  anyOf?: Omit<SchemaNumber, "type" | "name">[];
  /**
   * To validate against `allOf`, the given data must be valid against all of
   * the given subschemas.
   */
  allOf?: Omit<SchemaNumber, "type" | "name">[];
  /**
   * To validate against `oneOf`, the given data must be valid against exactly
   * one of the given subschemas.
   */
  oneOf?: Omit<SchemaNumber, "type" | "name">[];
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
  /**
   * To validate against `anyOf`, the given data must be valid against any (one
   * or more) of the given subschemas.
   */
  anyOf?: Omit<SchemaInteger, "type" | "name">[];
  /**
   * To validate against `allOf`, the given data must be valid against all of
   * the given subschemas.
   */
  allOf?: Omit<SchemaInteger, "type" | "name">[];
  /**
   * To validate against `oneOf`, the given data must be valid against exactly
   * one of the given subschemas.
   */
  oneOf?: Omit<SchemaInteger, "type" | "name">[];
}>;

/**
 * A boolean field definition.
 */
export type SchemaBoolean = SchemaFieldType<{
  /**
   * The type of the field.
   */
  type: "boolean";
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
   * The data type of the array items.
   */
  items?: Omit<SchemaField, "name">;
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
  /**
   * To validate against `anyOf`, the given data must be valid against any (one
   * or more) of the given subschemas.
   */
  anyOf?: Omit<SchemaArray, "type" | "name">[];
  /**
   * To validate against `allOf`, the given data must be valid against all of
   * the given subschemas.
   */
  allOf?: Omit<SchemaArray, "type" | "name">[];
  /**
   * To validate against `oneOf`, the given data must be valid against exactly
   * one of the given subschemas.
   */
  oneOf?: Omit<SchemaArray, "type" | "name">[];
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
   * The data type of the tuple items.
   */
  items?: Omit<SchemaField, "name">[];
  /**
   * To validate against `anyOf`, the given data must be valid against any (one
   * or more) of the given subschemas.
   */
  anyOf?: Omit<SchemaTuple, "type" | "name">[];
  /**
   * To validate against `oneOf`, the given data must be valid against exactly
   * one of the given subschemas.
   */
  oneOf?: Omit<SchemaTuple, "type" | "name">[];
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
 * A form UI content definition.
 */
export type SchemaUiContentful = {
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
  content: string;
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
 * A form UI definition.
 */
export type SchemaUi = {
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
  | SchemaStringDate
  | SchemaStringDatetime
  | SchemaNumber
  | SchemaInteger
  | SchemaBoolean
  | SchemaArray
  | SchemaTuple
  | SchemaNull
  | Omit<SchemaString, "name">
  | Omit<SchemaNumber, "name">
  | Omit<SchemaInteger, "name">
  | Omit<SchemaBoolean, "name">
  | Omit<SchemaArray, "name">
  | Omit<SchemaTuple, "name">
  | Omit<SchemaNull, "name">;

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
  conditionals: Omit<SchemaObject, "name">;
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

import schema from "../schema.json";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(schema);

describe("Schema", () => {
  it("should require `type`, `properties`, and `required`", () => {
    expect(validate({ type: "string" })).toBe(false);

    expect(validate({ type: "object" })).toBe(false);

    expect(validate({ type: "object", properties: "something" })).toBe(false);

    expect(validate({ type: "object", properties: {} })).toBe(false);

    expect(validate({ type: "object", properties: {}, required: [] })).toBe(true);

    expect(validate({ type: "array", properties: {}, required: [] })).toBe(false);
  });

  it("should require non-empty $schema", () => {
    expect(validate({ $schema: "", type: "object", properties: {}, required: [] })).toBe(false);

    expect(validate({ $schema: "something", type: "object", properties: {}, required: [] })).toBe(true);
  });

  it("should require non-empty $id", () => {
    expect(validate({ $id: "", type: "object", properties: {}, required: [] })).toBe(false);

    expect(validate({ $id: "something", type: "object", properties: {}, required: [] })).toBe(true);
  });

  it("should require non-empty $comment", () => {
    expect(validate({ $comment: "", type: "object", properties: {}, required: [] })).toBe(false);

    expect(validate({ $comment: "something", type: "object", properties: {}, required: [] })).toBe(true);
  });

  it("should require non-empty title", () => {
    expect(validate({ title: "", type: "object", properties: {}, required: [] })).toBe(false);

    expect(validate({ title: "something", type: "object", properties: {}, required: [] })).toBe(true);
  });

  it("should require non-empty description", () => {
    expect(validate({ description: "", type: "object", properties: {}, required: [] })).toBe(false);

    expect(validate({ description: "something", type: "object", properties: {}, required: [] })).toBe(true);
  });

  describe("object", () => {
    it("should allow object basic", () => {
      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "object"
            }
          },
          required: []
        })
      ).toBe(false); // Missing 'name' property in 'field'

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "object",
              name: "field"
            }
          },
          required: []
        })
      ).toBe(false); // Missing 'required' property in 'field'

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "object",
              name: "field",
              required: []
            }
          },
          required: []
        })
      ).toBe(true);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "object",
              name: "field",
              properties: {},
              required: []
            }
          },
          required: []
        })
      ).toBe(true);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "object",
              name: "field",
              patternProperties: {},
              required: []
            }
          },
          required: []
        })
      ).toBe(true);
    });

    it("should validate with if/then/else structure", () => {
      expect(validate({
        type: "object",
        properties: {
          conditionField: {
            type: "string",
            name: "conditionField"
          },
          field1: {
            type: "string",
            name: "field1"
          },
          field2: {
            type: "string",
            name: "field2"
          }
        },
        required: ["conditionField"],
        if: {
          properties: {
            conditionField: {
              type: "string",
              minLength: 3
            }
          },
        },
        then: {
          type: "object",
          properties: {
            field1: {
              type: "string",
              name: "field1",
              minLength: 5
            }
          },
          required: ["field1"]
        },
        else: {
          type: "object",
          properties: {
            field2: {
              type: "string",
              name: "field2",
              minLength: 2
            }
          },
          required: ["field2"]
        }
      })).toBe(true);
    });
  });

  describe("string", () => {
    it("should allow string basic", () => {
      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "string",
            },
          },
          required: [],
        }),
      ).toBe(false);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "string",
              name: "field",
            },
          },
          required: [],
        }),
      ).toBe(true);
    });
  });

  describe("date", () => {
    it("should allow date basic", () => {
      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "string",
            },
          },
          required: [],
        }),
      ).toBe(false);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "string",
              name: "field",
            },
          },
          required: [],
        }),
      ).toBe(true);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "string",
              name: "field",
              format: 'date'
            },
          },
          required: [],
        }),
      ).toBe(true);
    });
  });

  describe("number", () => {
    it("should allow number basic", () => {
      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "number",
            },
          },
          required: [],
        }),
      ).toBe(false);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "number",
              name: "field",
            },
          },
          required: [],
        }),
      ).toBe(true);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "number",
              name: "field",
              minimum: 1,
              maximum: 10,
            },
          },
          required: [],
        }),
      ).toBe(true);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "number",
              name: "field",
              minimum: ["(", 1],
              maximum: [")", 10],
            },
          },
          required: [],
        }),
      ).toBe(true);
    });
  });

  describe("integer", () => {
    it("should allow integer basic", () => {
      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "integer",
            },
          },
          required: [],
        }),
      ).toBe(false);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "integer",
              name: "field",
            },
          },
          required: [],
        }),
      ).toBe(true);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "integer",
              name: "field",
              minimum: 1,
              maximum: 10,
            },
          },
          required: [],
        }),
      ).toBe(true);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "integer",
              name: "field",
              minimum: ["(", 1],
              maximum: [")", 10],
            },
          },
          required: [],
        }),
      ).toBe(true);
    });
  });

  describe("boolean", () => {
    it("should allow boolean basic", () => {
      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "boolean",
            },
          },
          required: [],
        }),
      ).toBe(false);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "boolean",
              name: "field",
            },
          },
          required: [],
        }),
      ).toBe(true);
    });
  });

  describe("array", () => {
    it("should allow array basic", () => {
      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "array",
              items: {
                type: "string",
                name: "strField",
              },
            },
          },
          required: ["field"],
        }),
      ).toBe(false);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "array",
              name: "field",
              items: {
                type: "string",
                name: "strField",
              },
            },
          },
          required: ["field"],
        }),
      ).toBe(true);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "array",
              name: "field",
              items: {
                type: "string",
                name: "strField",
              },
              minItems: 1,
              maxItems: 10,
              uniqueItems: true,
            },
          },
          required: ["field"],
        }),
      ).toBe(true);
    });

    it("should validate nested array structures", () => {
      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "array",
              name: "field",
              items: {
                type: "array",
                name: "arrField",
                items: {
                  type: "string",
                  name: "strField",
                },
              },
            },
          },
          required: ["field"],
        }),
      ).toBe(true);
    });
  });

  describe("tuple", () => {
    it("should allow tuple basic", () => {
      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "tuple",
              items: [
                { type: "string", name: "tupleStrField" },
                { type: "number", name: "tupleNumField" }
              ]
            },
          },
          required: ["field"],
        }),
      ).toBe(false);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "tuple",
              name: "field",
              items: [
                { type: "string", name: "strField" },
                { type: "number", name: "numField" }
              ],
            },
          },
          required: ["field"],
        }),
      ).toBe(true);
    });

    it("should validate complex tuple structures", () => {
      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "tuple",
              name: "field",
              items: [
                { type: "string", name: "strField" },
                {
                  type: "array",
                  name: "arrField",
                  items: { type: "number", name: "arrNumField" },
                }
              ],
            },
          },
          required: ["field"],
        }),
      ).toBe(true);
    });
  });

  describe("null", () => {
    it("should allow null basic", () => {
      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "null",
            },
          },
          required: [],
        }),
      ).toBe(false);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "null",
              name: "field",
            },
          },
          required: [],
        }),
      ).toBe(true);
    });
  });

  describe("contentful", () => {
    it("should allow contentful basic", () => {
      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "h1",
            },
          },
          required: [],
        }),
      ).toBe(true);

      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "h1",
              content: "Header 1",
            },
          },
          required: [],
        }),
      ).toBe(true);
    });
  });

  describe("hr", () => {
    it("should allow hr basic", () => {
      expect(
        validate({
          type: "object",
          properties: {
            field: {
              type: "hr",
            },
          },
          required: [],
        }),
      ).toBe(true);
    });
  });
});

import form from "../src/index";

describe("default", () => {
  it("should set default values", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
            enum: ["test"],
          },
        },
        required: ["string"],
      },
      {},
      {
        defaults: { string: "test", other: "test" },
      }
    );

    expect(state).toEqual({ string: "test", other: "test" });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("should set default values from schema", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
            enum: ["test"],
            attrs: {
              default: "test",
            },
          },
        },
        required: ["string"],
      },
      {},
      {
        defaults: { other: "test" },
      }
    );

    expect(state).toEqual({ string: "test", other: "test" });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("should override schema default values", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",

            enum: ["test"],
            attrs: {
              default: "banana",
            },
          },
        },
        required: ["string"],
      },
      {},
      {
        defaults: {  string: "test", other: "test" },
      }
    );

    expect(state).toEqual({ string: "test", other: "test" });
    expect(schema.safeParse(state).success).toBe(true);
  });
});

import form from "../src/index";

describe("default", () => {
  it("should set default values", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          string: {
            type: "string",
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
});

import form from "../src/index";

describe("impl", () => {
  it("should accept arbitraty impl", () => {
    const { state, schema, isValid } = form(
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
        impl: {
          isValid() {
            return schema.safeParse(state).success;
          },
        },
      }
    );

    expect(state).toEqual({});
    expect(isValid()).toBe(false);

    state.string = "test";
    expect(state).toEqual({ string: "test" });
    expect(isValid()).toBe(true);
  });
});

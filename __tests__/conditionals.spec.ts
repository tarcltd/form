import form from "../src/index";

describe("Conditionals", () => {
  it("should require if", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        string: {
          type: "string",
          name: "String",
        },
      },
      required: ["string"],
      then: {
        type: "object",
        properties: {
          other: {
            type: "string",
            name: "Other",
            minLength: 3,
            maxLength: 10,
          },
        },
        required: ["other"],
      },
    });

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "something";
    expect(state).toEqual({ string: "something" });
    expect(schema.safeParse(state).success).toBe(true);

    state.string = "test";
    expect(state).toEqual({ string: "test" });
    expect(schema.safeParse(state).success).toBe(true);

    state.other = "a";
    expect(state).toEqual({ string: "test", other: "a" });
    expect(schema.safeParse(state).success).toBe(true);

    state.other = "abc";
    expect(state).toEqual({ string: "test", other: "abc" });
    expect(schema.safeParse(state).success).toBe(true);

    state.other = "a".repeat(11);
    expect(state).toEqual({ string: "test", other: "a".repeat(11) });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("should require then", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        string: {
          type: "string",
          name: "String",
        },
      },
      required: ["string"],
      then: {
        type: "object",
        properties: {
          other: {
            type: "string",
            name: "Other",
            minLength: 3,
            maxLength: 10,
          },
        },
        required: ["other"],
      },
    });

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "something";
    expect(state).toEqual({ string: "something" });
    expect(schema.safeParse(state).success).toBe(true);

    state.string = "test";
    expect(state).toEqual({ string: "test" });
    expect(schema.safeParse(state).success).toBe(true);

    state.other = "a";
    expect(state).toEqual({ string: "test", other: "a" });
    expect(schema.safeParse(state).success).toBe(true);

    state.other = "abc";
    expect(state).toEqual({ string: "test", other: "abc" });
    expect(schema.safeParse(state).success).toBe(true);

    state.other = "a".repeat(11);
    expect(state).toEqual({ string: "test", other: "a".repeat(11) });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("should conditionally require a field with if / then", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        string: {
          type: "string",
          name: "String",
        },
      },
      required: ["string"],
      if: {
        properties: {
          string: {
            type: "string",
            enum: ["test"],
          },
        },
      },
      then: {
        type: "object",
        properties: {
          other: {
            type: "string",
            name: "Other",
            minLength: 3,
            maxLength: 10,
          },
        },
        required: ["other"],
      },
    });

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "something";
    expect(state).toEqual({ string: "something" });
    expect(schema.safeParse(state).success).toBe(true);

    state.string = "test";
    expect(state).toEqual({ string: "test" });
    expect(schema.safeParse(state).success).toBe(false);

    state.other = "a";
    expect(state).toEqual({ string: "test", other: "a" });
    expect(schema.safeParse(state).success).toBe(false);

    state.other = "abc";
    expect(state).toEqual({ string: "test", other: "abc" });
    expect(schema.safeParse(state).success).toBe(true);

    state.other = "a".repeat(11);
    expect(state).toEqual({ string: "test", other: "a".repeat(11) });
    expect(schema.safeParse(state).success).toBe(false);
  });

  it("should support if / then / else", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        string: {
          type: "string",
          name: "String",
        },
      },
      required: ["string"],
      if: {
        properties: {
          string: {
            type: "string",
            enum: ["test"],
          },
        },
      },
      then: {
        type: "object",
        properties: {
          other: {
            type: "string",
            name: "Other",
            minLength: 3,
            maxLength: 10,
          },
        },
        required: ["other"],
      },
      else: {
        type: "object",
        properties: {
          other: {
            type: "string",
            name: "Other",
            minLength: 11,
          },
        },
        required: ["other"],
      },
    });

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "something";
    expect(state).toEqual({ string: "something" });
    expect(schema.safeParse(state).success).toBe(false);

    state.other = "a".repeat(11);
    expect(state).toEqual({ string: "something", other: "a".repeat(11) });
    expect(schema.safeParse(state).success).toBe(true);

    state.string = "test";
    expect(state).toEqual({ string: "test", other: "a".repeat(11) });
    expect(schema.safeParse(state).success).toBe(false);

    state.other = "a";
    expect(state).toEqual({ string: "test", other: "a" });
    expect(schema.safeParse(state).success).toBe(false);

    state.other = "abc";
    expect(state).toEqual({ string: "test", other: "abc" });
    expect(schema.safeParse(state).success).toBe(true);

    state.other = "a".repeat(11);
    expect(state).toEqual({ string: "test", other: "a".repeat(11) });
    expect(schema.safeParse(state).success).toBe(false);
  });

  it("should support complex if", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        string: {
          type: "string",
          name: "String",
        },
      },
      required: ["string"],
      if: {
        properties: {
          string: {
            type: "string",
            includes: "another great test",
          },
        },
      },
      then: {
        type: "object",
        properties: {
          other: {
            type: "string",
            name: "Other",
            length: 3,
          },
        },
        required: ["other"],
      },
    });

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "something";
    expect(state).toEqual({ string: "something" });
    expect(schema.safeParse(state).success).toBe(true);

    state.string = "something something another great test";
    expect(state).toEqual({ string: "something something another great test" });
    expect(schema.safeParse(state).success).toBe(false);

    state.other = "a";
    expect(state).toEqual({
      string: "something something another great test",
      other: "a",
    });
    expect(schema.safeParse(state).success).toBe(false);

    state.other = "abc";
    expect(state).toEqual({
      string: "something something another great test",
      other: "abc",
    });
    expect(schema.safeParse(state).success).toBe(true);

    state.other = "a".repeat(11);
    expect(state).toEqual({
      string: "something something another great test",
      other: "a".repeat(11),
    });
    expect(schema.safeParse(state).success).toBe(false);
  });
});

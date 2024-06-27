import form from "../src/index";

describe("oneOf", () => {
  it("should support string oneOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        string: {
          type: "string",
          name: "String",
          oneOf: [
            {
              minLength: 3,
              maxLength: 10,
            },
            {
              length: 1,
            },
            {
              includes: "test",
            },
          ],
        },
      },
      required: ["string"],
    });

    state.string = "a";
    expect(schema.safeParse(state).success).toBe(true);

    state.string = "aaa";
    expect(schema.safeParse(state).success).toBe(true);

    state.string = "some test value that is too long";
    expect(schema.safeParse(state).success).toBe(true);

    state.string = "aa";
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "test";
    expect(schema.safeParse(state).success).toBe(false);
  });

  it("should support date oneOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        date: {
          type: "string",
          name: "Date",
          format: "date",
          oneOf: [
            {
              minimum: "2024-08-01",
              maximum: "2024-08-31",
            },
            {
              minimum: "2023-08-01",
              maximum: "2023-09-01",
            },
          ],
        },
      },
      required: ["date"],
    });

    state.date = "2023-08-01";
    expect(schema.safeParse(state).success).toBe(true);

    state.date = "2024-09-02";
    expect(schema.safeParse(state).success).toBe(false);

    state.date = "2023-09-01";
    expect(schema.safeParse(state).success).toBe(true);

    state.date = "2024-08-15";
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("should support date-time oneOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        datetime: {
          type: "string",
          name: "Datetime",
          format: "date-time",
          oneOf: [
            {
              minimum: "2024-08-01T12:00:00Z",
              maximum: "2024-08-31T12:00:00Z",
            },
            {
              minimum: "2023-08-01T12:00:00Z",
              maximum: "2023-09-01T12:00:00Z",
            },
          ],
        },
      },
      required: ["datetime"],
    });

    state.datetime = "2023-08-01T12:00:00Z";
    expect(schema.safeParse(state).success).toBe(true);

    state.datetime = "2024-09-02T12:00:00Z";
    expect(schema.safeParse(state).success).toBe(false);

    state.datetime = "2023-09-01T12:00:00Z";
    expect(schema.safeParse(state).success).toBe(true);

    state.datetime = "2024-08-15T12:00:00Z";
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("should support number oneOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        number: {
          type: "number",
          name: "Number",
          oneOf: [
            {
              minimum: 0,
              maximum: 10,
            },
            {
              multipleOf: 4,
            },
            {
              exclusiveMinimum: 42,
            },
          ],
        },
      },
      required: ["number"],
    });

    state.number = 1;
    expect(schema.safeParse(state).success).toBe(true);

    state.number = 0;
    expect(schema.safeParse(state).success).toBe(false);

    state.number = 16;
    expect(schema.safeParse(state).success).toBe(true);

    state.number = 64;
    expect(schema.safeParse(state).success).toBe(false);

    state.number = 43;
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("should support integer oneOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        integer: {
          type: "integer",
          name: "Integer",
          oneOf: [
            {
              minimum: 0,
              maximum: 10,
            },
            {
              multipleOf: 4,
            },
            {
              exclusiveMinimum: 42,
            },
          ],
        },
      },
      required: ["integer"],
    });

    state.integer = 1;
    expect(schema.safeParse(state).success).toBe(true);

    state.integer = 0;
    expect(schema.safeParse(state).success).toBe(false);

    state.integer = 16;
    expect(schema.safeParse(state).success).toBe(true);

    state.integer = 64;
    expect(schema.safeParse(state).success).toBe(false);

    state.integer = 43;
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("should support array oneOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        array: {
          type: "array",
          name: "Array",
          oneOf: [
            {
              items: {
                type: "number",
              },
              minItems: 1,
              maxItems: 10,
            },
            {
              items: {
                type: "string",
              },
              minItems: 1,
              maxItems: 10,
            },
            {
              items: {
                type: "number",
              },
              uniqueItems: true,
            },
          ],
        },
      },
      required: ["array"],
    });

    state.array = [];
    expect(schema.safeParse(state).success).toBe(true);

    state.array = [23];
    expect(schema.safeParse(state).success).toBe(false);

    state.array = ["hello", "world"];
    expect(schema.safeParse(state).success).toBe(true);

    state.array = [23, 42, 64, 64];
    expect(schema.safeParse(state).success).toBe(true);

    state.array = Array.from({ length: 11 }, (_, k) => k);
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("should support tuple oneOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        tuple: {
          type: "tuple",
          name: "Tuple",
          oneOf: [
            {
              items: [
                {
                  type: "number",
                },
                {
                  type: "string",
                },
              ],
            },
            {
              items: [
                {
                  type: "string",
                },
                {
                  type: "number",
                },
              ],
            },
            {
              items: [
                {
                  type: "number",
                },
                {
                  type: "boolean",
                },
                {
                  type: "boolean",
                },
              ],
            },
            {
              items: [
                {
                  type: "boolean",
                },
                {
                  type: "boolean",
                },
                {
                  type: "boolean",
                },
              ],
            },
            {
              items: [
                {
                  type: "boolean",
                },
                {
                  type: "boolean",
                },
                {
                  type: "boolean",
                },
              ],
            },
          ],
        },
      },
      required: ["tuple"],
    });

    state.tuple = [23];
    expect(schema.safeParse(state).success).toBe(false);

    state.tuple = [23, "test"];
    expect(schema.safeParse(state).success).toBe(true);

    state.tuple = ["test", 42];
    expect(schema.safeParse(state).success).toBe(true);

    state.tuple = [23, "test", 42];
    expect(schema.safeParse(state).success).toBe(false);

    state.tuple = [23, true, false];
    expect(schema.safeParse(state).success).toBe(true);

    state.tuple = [23, "test", 42, false];
    expect(schema.safeParse(state).success).toBe(false);

    state.tuple = [true, true, true];
    expect(schema.safeParse(state).success).toBe(false);
  });
});

import form from "../src/index";

describe("anyOf", () => {
  it("should support string anyOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        string: {
          type: "string",
          name: "String",
          anyOf: [
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

    state.string = "aa";
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "aaa";
    expect(schema.safeParse(state).success).toBe(true);

    state.string = "some test value";
    expect(schema.safeParse(state).success).toBe(true);

    state.string = "a";
    expect(schema.safeParse(state).success).toBe(true);

    state.string = "";
    expect(schema.safeParse(state).success).toBe(false);
  });

  it("should support date anyOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        date: {
          type: "string",
          name: "Date",
          format: "date",
          anyOf: [
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

  it("should support date-time anyOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        datetime: {
          type: "string",
          name: "Datetime",
          format: "date-time",
          anyOf: [
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

  it("should support number anyOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        number: {
          type: "number",
          name: "Number",
          anyOf: [
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

    state.number = -1;
    expect(schema.safeParse(state).success).toBe(false);

    state.number = 0;
    expect(schema.safeParse(state).success).toBe(true);

    state.number = 16;
    expect(schema.safeParse(state).success).toBe(true);

    state.number = 43;
    expect(schema.safeParse(state).success).toBe(true);

    state.number = 42;
    expect(schema.safeParse(state).success).toBe(false);

    state.number = -42;
    expect(schema.safeParse(state).success).toBe(false);
  });

  it("should support integer anyOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        integer: {
          type: "integer",
          name: "Integer",
          anyOf: [
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

    state.integer = -1;
    expect(schema.safeParse(state).success).toBe(false);

    state.integer = 0;
    expect(schema.safeParse(state).success).toBe(true);

    state.integer = 16;
    expect(schema.safeParse(state).success).toBe(true);

    state.integer = 43;
    expect(schema.safeParse(state).success).toBe(true);

    state.integer = 42;
    expect(schema.safeParse(state).success).toBe(false);

    state.integer = -42;
    expect(schema.safeParse(state).success).toBe(false);
  });

  it("should support array anyOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        array: {
          type: "array",
          name: "Array",
          anyOf: [
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
    expect(schema.safeParse(state).success).toBe(true);

    state.array = [23, 42, 64];
    expect(schema.safeParse(state).success).toBe(true);

    state.array = Array.from({ length: 11 }, () => 42);
    expect(schema.safeParse(state).success).toBe(false);
  });

  it("should support tuple anyOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        tuple: {
          type: "tuple",
          name: "Tuple",
          anyOf: [
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
  });
});

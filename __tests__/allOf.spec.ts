import form from "../src/index";

describe("allOf", () => {
  it("should support string allOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        string: {
          type: "string",
          name: "String",
          allOf: [
            {
              minLength: 3,
              maxLength: 10,
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
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "some test value";
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "test";
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("should support date allOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        date: {
          type: "string",
          name: "Date",
          format: "date",
          allOf: [
            {
              minimum: "2024-08-01",
            },
            {
              maximum: "2024-09-01",
            },
          ],
        },
      },
      required: ["date"],
    });

    state.date = "2024-07-01";
    expect(schema.safeParse(state).success).toBe(false);

    state.date = "2024-09-01";
    expect(schema.safeParse(state).success).toBe(true);

    state.date = "2024-09-02";
    expect(schema.safeParse(state).success).toBe(false);
  });

  it("should support date-time allOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        datetime: {
          type: "string",
          name: "Datetime",
          format: "date-time",
          allOf: [
            {
              minimum: "2024-08-01T12:00:00Z",
            },
            {
              maximum: "2024-08-31T12:00:00Z",
            },
          ],
        },
      },
      required: ["datetime"],
    });

    state.datetime = "2024-07-01T12:00:00Z";
    expect(schema.safeParse(state).success).toBe(false);

    state.datetime = "2024-08-31T12:00:00Z";
    expect(schema.safeParse(state).success).toBe(true);

    state.datetime = "2024-09-01T12:00:00Z";
    expect(schema.safeParse(state).success).toBe(false);
  });

  it("should support number allOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        number: {
          type: "number",
          name: "Number",
          allOf: [
            {
              minimum: 0,
              maximum: 10,
            },
            {
              multipleOf: 4,
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

    state.number = 4;
    expect(schema.safeParse(state).success).toBe(true);

    state.number = 16;
    expect(schema.safeParse(state).success).toBe(false);
  });

  it("should support integer allOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        integer: {
          type: "integer",
          name: "Integer",
          allOf: [
            {
              minimum: 0,
              maximum: 10,
            },
            {
              multipleOf: 4,
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

    state.integer = 4;
    expect(schema.safeParse(state).success).toBe(true);

    state.integer = 16;
    expect(schema.safeParse(state).success).toBe(false);
  });

  it("should support array allOf", async () => {
    const { state, schema } = form({
      type: "object",
      properties: {
        array: {
          type: "array",
          name: "Array",
          allOf: [
            {
              items: {
                type: "number",
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
    expect(schema.safeParse(state).success).toBe(false);

    state.array = [23];
    expect(schema.safeParse(state).success).toBe(true);

    state.array = [23, 42, 64];
    expect(schema.safeParse(state).success).toBe(true);

    state.array = Array.from({ length: 10 }, () => 42);
    expect(schema.safeParse(state).success).toBe(false);
  });
});

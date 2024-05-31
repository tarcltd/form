import form from "../src/index";

describe("fields", () => {
  it("supports header", () => {
    const { input, state } = form(
      {
        type: "object",
        properties: {
          name: {
            type: "header",
            name: "Name",
          },
        },
        required: [],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(input).toEqual({
      type: "object",
      properties: {
        name: {
          type: "header",
          name: "Name",
        },
      },
      required: [],
    });
  });

  it("supports subheader", () => {
    const { input, state } = form(
      {
        type: "object",
        properties: {
          name: {
            type: "subheader",
            name: "Name",
          },
        },
        required: [],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(input).toEqual({
      type: "object",
      properties: {
        name: {
          type: "subheader",
          name: "Name",
        },
      },
      required: [],
    });
  });

  it("supports hr", () => {
    const { input, state } = form(
      {
        type: "object",
        properties: {
          hr: {
            type: "hr",
          },
        },
        required: [],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(input).toEqual({
      type: "object",
      properties: {
        hr: {
          type: "hr",
        },
      },
      required: [],
    });
  });

  it("supports info", () => {
    const { input, state } = form(
      {
        type: "object",
        properties: {
          info: {
            type: "info",
          },
        },
        required: [],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(input).toEqual({
      type: "object",
      properties: {
        info: {
          type: "info",
        },
      },
      required: [],
    });
  });

  it("supports string", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          string: {
            type: "string",
          },
        },
        required: ["string"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.string = 0;
    expect(state).toEqual({ string: 0 });
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "test";
    expect(state).toEqual({ string: "test" });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports lengths", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          string: {
            type: "string",
            minLength: 3,
            maxLength: 10,
          },
        },
        required: ["string"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "a";
    expect(state).toEqual({ string: "a" });
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "a".repeat(10);
    expect(state).toEqual({ string: "a".repeat(10) });
    expect(schema.safeParse(state).success).toBe(true);

    state.string = "a".repeat(11);
    expect(state).toEqual({ string: "a".repeat(11) });
    expect(schema.safeParse(state).success).toBe(false);
  });

  it("supports enum", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          string: {
            type: "string",
            enum: ["a", "b", "c"],
          },
        },
        required: ["string"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "d";
    expect(state).toEqual({ string: "d" });
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "a";
    expect(state).toEqual({ string: "a" });
    expect(schema.safeParse(state).success).toBe(true);

    state.string = "b";
    expect(state).toEqual({ string: "b" });
    expect(schema.safeParse(state).success).toBe(true);

    state.string = "c";
    expect(state).toEqual({ string: "c" });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports pattern", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          string: {
            type: "string",
            pattern: "[0-9]{3}",
          },
        },
        required: ["string"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "test";
    expect(state).toEqual({ string: "test" });
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "123";
    expect(state).toEqual({ string: "123" });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports includes", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          string: {
            type: "string",
            includes: "test",
          },
        },
        required: ["string"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "some value";
    expect(state).toEqual({ string: "some value" });
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "some test value";
    expect(state).toEqual({ string: "some test value" });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports startsWith", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          string: {
            type: "string",
            startsWith: "test",
          },
        },
        required: ["string"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "some test";
    expect(state).toEqual({ string: "some test" });
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "test some";
    expect(state).toEqual({ string: "test some" });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports endsWith", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          string: {
            type: "string",
            endsWith: "test",
          },
        },
        required: ["string"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "test some";
    expect(state).toEqual({ string: "test some" });
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "some test";
    expect(state).toEqual({ string: "some test" });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports uuid", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          uuid: {
            type: "uuid",
          },
        },
        required: ["uuid"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.uuid = "00000000-0000-0000-0000-00000000000";
    expect(state).toEqual({ uuid: "00000000-0000-0000-0000-00000000000" });
    expect(schema.safeParse(state).success).toBe(false);

    state.uuid = "00000000-0000-0000-0000-000000000000";
    expect(state).toEqual({ uuid: "00000000-0000-0000-0000-000000000000" });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports url", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          url: {
            type: "url",
          },
        },
        required: ["url"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.url = "test";
    expect(state).toEqual({ url: "test" });
    expect(schema.safeParse(state).success).toBe(false);

    state.url = "http://test.com";
    expect(state).toEqual({ url: "http://test.com" });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports ip", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          ip: {
            type: "ip",
          },
        },
        required: ["ip"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.ip = "test";
    expect(state).toEqual({ ip: "test" });
    expect(schema.safeParse(state).success).toBe(false);

    state.ip = "192.168.0.1";
    expect(state).toEqual({ ip: "192.168.0.1" });
    expect(schema.safeParse(state).success).toBe(true);

    state.ip = "::1";
    expect(state).toEqual({ ip: "::1" });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports email", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          email: {
            type: "email",
          },
        },
        required: ["email"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.email = "test";
    expect(state).toEqual({ email: "test" });
    expect(schema.safeParse(state).success).toBe(false);

    state.email = "test@test.com";
    expect(state).toEqual({ email: "test@test.com" });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports date", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          date: {
            type: "date",
          },
        },
        required: ["date"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.date = "test";
    expect(state).toEqual({ date: "test" });
    expect(schema.safeParse(state).success).toBe(false);

    state.date = "08/01/24";
    expect(state).toEqual({ date: "08/01/24" });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports datetime", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          datetime: {
            type: "datetime",
          },
        },
        required: ["datetime"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.datetime = "test";
    expect(state).toEqual({ datetime: "test" });
    expect(schema.safeParse(state).success).toBe(false);

    state.datetime = "2024-08-01T12:00:00Z";
    expect(state).toEqual({ datetime: "2024-08-01T12:00:00Z" });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports time", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          time: {
            type: "time",
          },
        },
        required: ["time"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.time = "test";
    expect(state).toEqual({ time: "test" });
    expect(schema.safeParse(state).success).toBe(false);

    state.time = "12:00:00";
    expect(state).toEqual({ time: "12:00:00" });
    expect(schema.safeParse(state).success).toBe(true);

    state.time = "23:59:59";
    expect(state).toEqual({ time: "23:59:59" });
    expect(schema.safeParse(state).success).toBe(true);

    state.time = "25:59:59";
    expect(state).toEqual({ time: "25:59:59" });
    expect(schema.safeParse(state).success).toBe(false);
  });

  it("supports number", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          number: {
            type: "number",
          },
        },
        required: ["number"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.number = "";
    expect(state).toEqual({ number: "" });
    expect(schema.safeParse(state).success).toBe(false);

    state.number = 42;
    expect(state).toEqual({ number: 42 });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports min and max", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          number: {
            type: "number",
            min: 0,
            max: 10,
          },
        },
        required: ["number"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.number = -1;
    expect(state).toEqual({ number: -1 });
    expect(schema.safeParse(state).success).toBe(false);

    state.number = 1;
    expect(state).toEqual({ number: 1 });
    expect(schema.safeParse(state).success).toBe(true);

    state.number = 11;
    expect(state).toEqual({ number: 11 });
    expect(schema.safeParse(state).success).toBe(false);
  });

  it("supports boolean", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          boolean: {
            type: "boolean",
          },
        },
        required: ["boolean"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.boolean = "";
    expect(state).toEqual({ boolean: "" });
    expect(schema.safeParse(state).success).toBe(false);

    state.boolean = true;
    expect(state).toEqual({ boolean: true });
    expect(schema.safeParse(state).success).toBe(true);

    state.boolean = false;
    expect(state).toEqual({ boolean: false });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports array", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          array: {
            type: "array",
            data: "number",
          },
        },
        required: ["array"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.array = "";
    expect(state).toEqual({ array: "" });
    expect(schema.safeParse(state).success).toBe(false);

    state.array = [42];
    expect(state).toEqual({ array: [42] });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports null", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          null: {
            type: "null",
            data: ["number", "string"],
          },
        },
        required: ["null"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.null = "test";
    expect(state).toEqual({ null: "test" });
    expect(schema.safeParse(state).success).toBe(false);

    state.null = null;
    expect(state).toEqual({ null: null });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports nullable", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          string: {
            type: "string",
            nullable: true,
          },
        },
        required: ["string"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.string = 0;
    expect(state).toEqual({ string: 0 });
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "test";
    expect(state).toEqual({ string: "test" });
    expect(schema.safeParse(state).success).toBe(true);

    state.string = null;
    expect(state).toEqual({ string: null });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports optional", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          string: {
            type: "string",
          },
          optional: {
            type: "string",
          },
        },
        required: ["string"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.string = 0;
    expect(state).toEqual({ string: 0 });
    expect(schema.safeParse(state).success).toBe(false);

    state.string = "test";
    expect(state).toEqual({ string: "test" });
    expect(schema.safeParse(state).success).toBe(true);

    state.optional = "test";
    expect(state).toEqual({ string: "test", optional: "test" });
    expect(schema.safeParse(state).success).toBe(true);
  });

  it("supports sub-objects", () => {
    const { state, schema } = form(
      {
        type: "object",
        properties: {
          object: {
            type: "object",
            properties: {
              string: {
                type: "string",
              },
            },
            required: ["string"],
          },
        },
        required: ["object"],
      },
      {},
      {}
    );

    expect(state).toEqual({});
    expect(schema.safeParse(state).success).toBe(false);

    state.object = {};
    expect(state).toEqual({ object: {} });
    expect(schema.safeParse(state).success).toBe(false);

    state.object = { string: 'test' };
    expect(state).toEqual({ object: { string: 'test'} });
    expect(schema.safeParse(state).success).toBe(true);
  });
});

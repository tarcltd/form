import form from "../src/index";

describe("fields", () => {
  describe("misc", () => {
    it("removes extraneous fields", () => {
      const { state, reset } = form(
        {
          type: "object",
          properties: {
            name: {
              type: "string",
              name: "Name",
            },
          },
          required: ["name"],
        },
        undefined,
        {
          defaults: { name: "John Doe" },
        }
      );

      expect(state).toEqual({ name: "John Doe" });

      state.something = "test";
      expect(state).toEqual({ name: "John Doe", something: "test" });

      reset();

      expect(state).toEqual({ name: "John Doe" });
    });

    it("supports content items", () => {
      const { input, state } = form({
        type: "object",
        properties: {
          name: {
            type: "h1",
            content: "Name",
          },
        },
        required: [],
      });

      expect(state).toEqual({});
      expect(input).toEqual({
        type: "object",
        properties: {
          name: {
            type: "h1",
            content: "Name",
          },
        },
        required: [],
      });
    });

    it("supports hr", () => {
      const { input, state } = form({
        type: "object",
        properties: {
          hr: {
            type: "hr",
          },
        },
        required: [],
      });

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
  });

  describe("string", () => {
    it("supports string", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
          },
        },
        required: ["string"],
      });

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
      const { state, schema } = form({
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
            minLength: 3,
            maxLength: 10,
          },
        },
        required: ["string"],
      });

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

    it("supports length", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
            length: 3,
          },
        },
        required: ["string"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.string = "a";
      expect(state).toEqual({ string: "a" });
      expect(schema.safeParse(state).success).toBe(false);

      state.string = "a".repeat(3);
      expect(state).toEqual({ string: "a".repeat(3) });
      expect(schema.safeParse(state).success).toBe(true);

      state.string = "a".repeat(4);
      expect(state).toEqual({ string: "a".repeat(4) });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports enum", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
            enum: ["a", "b", "c"],
          },
        },
        required: ["string"],
      });

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

    it("supports exclusive enum", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
            exclusiveEnum: ["a", "b", "c"],
          },
        },
        required: ["string"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.string = "d";
      expect(state).toEqual({ string: "d" });
      expect(schema.safeParse(state).success).toBe(true);

      state.string = "a";
      expect(state).toEqual({ string: "a" });
      expect(schema.safeParse(state).success).toBe(false);

      state.string = "b";
      expect(state).toEqual({ string: "b" });
      expect(schema.safeParse(state).success).toBe(false);

      state.string = "c";
      expect(state).toEqual({ string: "c" });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports pattern", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
            pattern: "[0-9]{3}",
          },
        },
        required: ["string"],
      });

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
      const { state, schema } = form({
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
            includes: "test",
          },
        },
        required: ["string"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.string = "some value";
      expect(state).toEqual({ string: "some value" });
      expect(schema.safeParse(state).success).toBe(false);

      state.string = "some test value";
      expect(state).toEqual({ string: "some test value" });
      expect(schema.safeParse(state).success).toBe(true);
    });

    it("supports includes array", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
            includes: ["test", "value"],
          },
        },
        required: ["string"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.string = "some value";
      expect(state).toEqual({ string: "some value" });
      expect(schema.safeParse(state).success).toBe(false);

      state.string = "some test";
      expect(state).toEqual({ string: "some test" });
      expect(schema.safeParse(state).success).toBe(false);

      state.string = "some test value";
      expect(state).toEqual({ string: "some test value" });
      expect(schema.safeParse(state).success).toBe(true);
    });

    it("supports excludes", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
            excludes: "test",
          },
        },
        required: ["string"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.string = "some value";
      expect(state).toEqual({ string: "some value" });
      expect(schema.safeParse(state).success).toBe(true);

      state.string = "some test value";
      expect(state).toEqual({ string: "some test value" });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports excludes array", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
            excludes: ["test", "value"],
          },
        },
        required: ["string"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.string = "some value";
      expect(state).toEqual({ string: "some value" });
      expect(schema.safeParse(state).success).toBe(false);

      state.string = "some test";
      expect(state).toEqual({ string: "some test" });
      expect(schema.safeParse(state).success).toBe(false);

      state.string = "some";
      expect(state).toEqual({ string: "some" });
      expect(schema.safeParse(state).success).toBe(true);
    });

    it("supports startsWith", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
            startsWith: "test",
          },
        },
        required: ["string"],
      });

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
      const { state, schema } = form({
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
            endsWith: "test",
          },
        },
        required: ["string"],
      });

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
      const { state, schema } = form({
        type: "object",
        properties: {
          uuid: {
            type: "string",
            name: "UUID",
            format: "uuid",
          },
        },
        required: ["uuid"],
      });

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
      const { state, schema } = form({
        type: "object",
        properties: {
          url: {
            type: "string",
            name: "URL",
            format: "url",
          },
        },
        required: ["url"],
      });

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
      const { state, schema } = form({
        type: "object",
        properties: {
          ip: {
            type: "string",
            name: "IP",
            format: "ip",
          },
        },
        required: ["ip"],
      });

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

    it("supports ipv4", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          ip: {
            type: "string",
            name: "IP",
            format: "ipv4",
          },
        },
        required: ["ip"],
      });

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
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports ipv6", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          ip: {
            type: "string",
            name: "IP",
            format: "ipv6",
          },
        },
        required: ["ip"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.ip = "test";
      expect(state).toEqual({ ip: "test" });
      expect(schema.safeParse(state).success).toBe(false);

      state.ip = "192.168.0.1";
      expect(state).toEqual({ ip: "192.168.0.1" });
      expect(schema.safeParse(state).success).toBe(false);

      state.ip = "::1";
      expect(state).toEqual({ ip: "::1" });
      expect(schema.safeParse(state).success).toBe(true);
    });

    it("supports email", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          email: {
            type: "string",
            name: "Email",
            format: "email",
          },
        },
        required: ["email"],
      });

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
      const { state, schema } = form({
        type: "object",
        properties: {
          date: {
            type: "string",
            name: "Date",
            format: "date",
          },
        },
        required: ["date"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.date = "test";
      expect(state).toEqual({ date: "test" });
      expect(schema.safeParse(state).success).toBe(false);

      state.date = "08/01/24";
      expect(state).toEqual({ date: "08/01/24" });
      expect(schema.safeParse(state).success).toBe(true);
    });

    it("supports date with minimum and maximum", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          date: {
            type: "string",
            name: "Date",
            format: "date",
            minimum: "2024-08-01",
            maximum: "2024-08-31",
          },
        },
        required: ["date"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.date = "07/30/24";
      expect(state).toEqual({ date: "07/30/24" });
      expect(schema.safeParse(state).success).toBe(false);

      state.date = "08/01/24";
      expect(state).toEqual({ date: "08/01/24" });
      expect(schema.safeParse(state).success).toBe(true);

      state.date = "08/31/24";
      expect(state).toEqual({ date: "08/31/24" });
      expect(schema.safeParse(state).success).toBe(false);

      state.date = "09/01/24";
      expect(state).toEqual({ date: "09/01/24" });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports date with minimum and maximum alt", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          date: {
            type: "string",
            name: "Date",
            format: "date",
            minimum: ["[", "2024-08-01"],
            maximum: ["]", "2024-08-31"],
          },
        },
        required: ["date"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.date = "07/30/24";
      expect(state).toEqual({ date: "07/30/24" });
      expect(schema.safeParse(state).success).toBe(false);

      state.date = "08/01/24";
      expect(state).toEqual({ date: "08/01/24" });
      expect(schema.safeParse(state).success).toBe(true);

      state.date = "08/31/24";
      expect(state).toEqual({ date: "08/31/24" });
      expect(schema.safeParse(state).success).toBe(false);

      state.date = "09/01/24";
      expect(state).toEqual({ date: "09/01/24" });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it ("supports date with exclusive minimum and maximum", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          date: {
            type: "string",
            name: "Date",
            format: "date",
            exclusiveMinimum: "2024-08-01",
            exclusiveMaximum: "2024-08-31",
          },
        },
        required: ["date"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.date = "07/30/24";
      expect(state).toEqual({ date: "07/30/24" });
      expect(schema.safeParse(state).success).toBe(false);

      state.date = "08/01/24";
      expect(state).toEqual({ date: "08/01/24" });
      expect(schema.safeParse(state).success).toBe(true);

      state.date = "08/31/24";
      expect(state).toEqual({ date: "08/31/24" });
      expect(schema.safeParse(state).success).toBe(false);

      state.date = "09/01/24";
      expect(state).toEqual({ date: "09/01/24" });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it ("supports date with exclusive minimum and maximum alt", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          date: {
            type: "string",
            name: "Date",
            format: "date",
            minimum: ["(", "2024-08-01"],
            maximum: [")", "2024-08-31"],
          },
        },
        required: ["date"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.date = "07/30/24";
      expect(state).toEqual({ date: "07/30/24" });
      expect(schema.safeParse(state).success).toBe(false);

      state.date = "08/01/24";
      expect(state).toEqual({ date: "08/01/24" });
      expect(schema.safeParse(state).success).toBe(true);

      state.date = "08/31/24";
      expect(state).toEqual({ date: "08/31/24" });
      expect(schema.safeParse(state).success).toBe(false);

      state.date = "09/01/24";
      expect(state).toEqual({ date: "09/01/24" });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports date-time", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          datetime: {
            type: "string",
            name: "Datetime",
            format: "date-time",
          },
        },
        required: ["datetime"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.datetime = "test";
      expect(state).toEqual({ datetime: "test" });
      expect(schema.safeParse(state).success).toBe(false);

      state.datetime = "2024-08-01T12:00:00Z";
      expect(state).toEqual({ datetime: "2024-08-01T12:00:00Z" });
      expect(schema.safeParse(state).success).toBe(true);
    });

    it("supports date-time with minimum and maximum", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          datetime: {
            type: "string",
            name: "Datetime",
            format: "date-time",
            minimum: "2024-08-01",
            maximum: "2024-08-31",
          },
        },
        required: ["datetime"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.datetime = "2024-07-30T12:00:00Z";
      expect(state).toEqual({ datetime: "2024-07-30T12:00:00Z" });
      expect(schema.safeParse(state).success).toBe(false);

      state.datetime = "2024-08-01T12:00:00Z";
      expect(state).toEqual({ datetime: "2024-08-01T12:00:00Z" });
      expect(schema.safeParse(state).success).toBe(true);

      state.datetime = "2024-08-31T12:00:00Z";
      expect(state).toEqual({ datetime: "2024-08-31T12:00:00Z" });
      expect(schema.safeParse(state).success).toBe(false);

      state.datetime = "2024-09-01T12:00:00Z";
      expect(state).toEqual({ datetime: "2024-09-01T12:00:00Z" });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports time", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          time: {
            type: "string",
            name: "Time",
            format: "time",
          },
        },
        required: ["time"],
      });

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

    it("supports base64", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          base64: {
            type: "string",
            name: "Base64",
            format: "base64",
          },
        },
        required: ["base64"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.base64 = "123";
      expect(state).toEqual({ base64: "123" });
      expect(schema.safeParse(state).success).toBe(false);

      state.base64 = Buffer.from("test").toString("base64");
      expect(state).toEqual({ base64: "dGVzdA==" });
      expect(schema.safeParse(state).success).toBe(true);
    });
  });

  describe("number", () => {
    it("supports number", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "number",
            name: "Number",
          },
        },
        required: ["number"],
      });

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
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "number",
            name: "Number",
            minimum: 0,
            maximum: 10,
          },
        },
        required: ["number"],
      });

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

    it("supports min inclusive", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "number",
            name: "Number",
            minimum: ["[", 1],
          },
        },
        required: ["number"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.number = -1;
      expect(state).toEqual({ number: -1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 1;
      expect(state).toEqual({ number: 1 });
      expect(schema.safeParse(state).success).toBe(true);

      state.number = 2;
      expect(state).toEqual({ number: 2 });
      expect(schema.safeParse(state).success).toBe(true);
    });

    it("supports min exclusive", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "number",
            name: "Number",
            minimum: ["(", 1],
          },
        },
        required: ["number"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.number = -1;
      expect(state).toEqual({ number: -1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 1;
      expect(state).toEqual({ number: 1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 2;
      expect(state).toEqual({ number: 2 });
      expect(schema.safeParse(state).success).toBe(true);
    });

    it("supports max inclusive", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "number",
            name: "Number",
            maximum: ["]", 1],
          },
        },
        required: ["number"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.number = -1;
      expect(state).toEqual({ number: -1 });
      expect(schema.safeParse(state).success).toBe(true);

      state.number = 1;
      expect(state).toEqual({ number: 1 });
      expect(schema.safeParse(state).success).toBe(true);

      state.number = 2;
      expect(state).toEqual({ number: 2 });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports max exclusive", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "number",
            name: "Number",
            maximum: [")", 1],
          },
        },
        required: ["number"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.number = -1;
      expect(state).toEqual({ number: -1 });
      expect(schema.safeParse(state).success).toBe(true);

      state.number = 1;
      expect(state).toEqual({ number: 1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 2;
      expect(state).toEqual({ number: 2 });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports exclusive min", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "number",
            name: "Number",
            exclusiveMinimum: 1,
          },
        },
        required: ["number"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.number = -1;
      expect(state).toEqual({ number: -1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 1;
      expect(state).toEqual({ number: 1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 2;
      expect(state).toEqual({ number: 2 });
      expect(schema.safeParse(state).success).toBe(true);
    });

    it("supports exclusive max", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "number",
            name: "Number",
            exclusiveMaximum: 1,
          },
        },
        required: ["number"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.number = -1;
      expect(state).toEqual({ number: -1 });
      expect(schema.safeParse(state).success).toBe(true);

      state.number = 1;
      expect(state).toEqual({ number: 1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 2;
      expect(state).toEqual({ number: 2 });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports max multiple of", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "number",
            name: "Number",
            multipleOf: 2,
          },
        },
        required: ["number"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.number = -1;
      expect(state).toEqual({ number: -1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 1;
      expect(state).toEqual({ number: 1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 2;
      expect(state).toEqual({ number: 2 });
      expect(schema.safeParse(state).success).toBe(true);

      state.number = 64;
      expect(state).toEqual({ number: 64 });
      expect(schema.safeParse(state).success).toBe(true);
    });
  });

  describe("integer", () => {
    it("supports integer", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "integer",
            name: "Number",
          },
        },
        required: ["number"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.number = "";
      expect(state).toEqual({ number: "" });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 42;
      expect(state).toEqual({ number: 42 });
      expect(schema.safeParse(state).success).toBe(true);

      state.number = 42.6;
      expect(state).toEqual({ number: 42.6 });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports min and max", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "integer",
            name: "Number",
            minimum: 0,
            maximum: 10,
          },
        },
        required: ["number"],
      });

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

    it("supports min inclusive", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "integer",
            name: "Number",
            minimum: ["[", 1],
          },
        },
        required: ["number"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.number = -1;
      expect(state).toEqual({ number: -1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 1;
      expect(state).toEqual({ number: 1 });
      expect(schema.safeParse(state).success).toBe(true);

      state.number = 2;
      expect(state).toEqual({ number: 2 });
      expect(schema.safeParse(state).success).toBe(true);
    });

    it("supports min exclusive", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "integer",
            name: "Number",
            minimum: ["(", 1],
          },
        },
        required: ["number"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.number = -1;
      expect(state).toEqual({ number: -1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 1;
      expect(state).toEqual({ number: 1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 2;
      expect(state).toEqual({ number: 2 });
      expect(schema.safeParse(state).success).toBe(true);
    });

    it("supports max inclusive", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "integer",
            name: "Number",
            maximum: ["]", 1],
          },
        },
        required: ["number"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.number = -1;
      expect(state).toEqual({ number: -1 });
      expect(schema.safeParse(state).success).toBe(true);

      state.number = 1;
      expect(state).toEqual({ number: 1 });
      expect(schema.safeParse(state).success).toBe(true);

      state.number = 2;
      expect(state).toEqual({ number: 2 });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports max exclusive", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "integer",
            name: "Number",
            maximum: [")", 1],
          },
        },
        required: ["number"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.number = -1;
      expect(state).toEqual({ number: -1 });
      expect(schema.safeParse(state).success).toBe(true);

      state.number = 1;
      expect(state).toEqual({ number: 1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 2;
      expect(state).toEqual({ number: 2 });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports exclusive min", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "integer",
            name: "Number",
            exclusiveMinimum: 1,
          },
        },
        required: ["number"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.number = -1;
      expect(state).toEqual({ number: -1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 1;
      expect(state).toEqual({ number: 1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 2;
      expect(state).toEqual({ number: 2 });
      expect(schema.safeParse(state).success).toBe(true);
    });

    it("supports exclusive max", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "integer",
            name: "Number",
            exclusiveMaximum: 1,
          },
        },
        required: ["number"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.number = -1;
      expect(state).toEqual({ number: -1 });
      expect(schema.safeParse(state).success).toBe(true);

      state.number = 1;
      expect(state).toEqual({ number: 1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 2;
      expect(state).toEqual({ number: 2 });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports max multiple of", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          number: {
            type: "integer",
            name: "Number",
            multipleOf: 2,
          },
        },
        required: ["number"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.number = -1;
      expect(state).toEqual({ number: -1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 1;
      expect(state).toEqual({ number: 1 });
      expect(schema.safeParse(state).success).toBe(false);

      state.number = 2;
      expect(state).toEqual({ number: 2 });
      expect(schema.safeParse(state).success).toBe(true);

      state.number = 64;
      expect(state).toEqual({ number: 64 });
      expect(schema.safeParse(state).success).toBe(true);
    });
  });

  describe("boolean", () => {
    it("supports boolean", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          boolean: {
            type: "boolean",
            name: "Boolean",
          },
        },
        required: ["boolean"],
      });

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
  });

  describe("array", () => {
    it("supports array", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          array: {
            type: "array",
            name: "Array",
            items: {
              type: "number",
            },
          },
        },
        required: ["array"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.array = "";
      expect(state).toEqual({ array: "" });
      expect(schema.safeParse(state).success).toBe(false);

      state.array = [42];
      expect(state).toEqual({ array: [42] });
      expect(schema.safeParse(state).success).toBe(true);
    });

    it("supports min and max items in array", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          array: {
            type: "array",
            name: "Array",
            items: {
              type: "number",
            },
            minItems: 1,
            maxItems: 3,
          },
        },
        required: ["array"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.array = [23];
      expect(state).toEqual({ array: [23] });
      expect(schema.safeParse(state).success).toBe(true);

      state.array = [23, 42, 64];
      expect(state).toEqual({ array: [23, 42, 64] });
      expect(schema.safeParse(state).success).toBe(true);

      state.array = [23, 42, 64, 123];
      expect(state).toEqual({ array: [23, 42, 64, 123] });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports array length", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          array: {
            type: "array",
            name: "Array",
            items: {
              type: "number",
            },
            length: 3,
          },
        },
        required: ["array"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.array = [23];
      expect(state).toEqual({ array: [23] });
      expect(schema.safeParse(state).success).toBe(false);

      state.array = [23, 42, 64];
      expect(state).toEqual({ array: [23, 42, 64] });
      expect(schema.safeParse(state).success).toBe(true);

      state.array = [23, 42, 64, 123];
      expect(state).toEqual({ array: [23, 42, 64, 123] });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports nonempty array", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          array: {
            type: "array",
            name: "Array",
            items: {
              type: "number",
            },
            nonempty: true,
          },
        },
        required: ["array"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.array = [23];
      expect(state).toEqual({ array: [23] });
      expect(schema.safeParse(state).success).toBe(true);

      state.array = [];
      expect(state).toEqual({ array: [] });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("supports nonempty array", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          array: {
            type: "array",
            name: "Array",
            items: {
              type: "number",
            },
            uniqueItems: true,
          },
        },
        required: ["array"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.array = [23, 42];
      expect(state).toEqual({ array: [23, 42] });
      expect(schema.safeParse(state).success).toBe(true);

      state.array = [23, 23, 42];
      expect(state).toEqual({ array: [23, 23, 42] });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("exits array if items are not valid", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          array: {
            type: "array",
            name: "Array",
            /* biome-ignore lint/suspicious/noExplicitAny: */
            items: "blah" as any,
          },
        },
        required: ["array"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.array = "";
      expect(state).toEqual({ array: "" });
      expect(schema.safeParse(state).success).toBe(false);

      state.array = [42];
      expect(state).toEqual({ array: [42] });
      expect(schema.safeParse(state).success).toBe(true);
    });
  });

  describe("tuple", () => {
    it("supports tuple", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          tuple: {
            type: "tuple",
            name: "Tuple",
            items: [
              {
                type: "number",
              },
              {
                type: "string",
              },
            ],
          },
        },
        required: ["tuple"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.tuple = [23];
      expect(state).toEqual({ tuple: [23] });
      expect(schema.safeParse(state).success).toBe(false);

      state.tuple = [23, "test"];
      expect(state).toEqual({ tuple: [23, "test"] });
      expect(schema.safeParse(state).success).toBe(true);

      state.tuple = [23, "test", 42];
      expect(state).toEqual({ tuple: [23, "test", 42] });
      expect(schema.safeParse(state).success).toBe(false);
    });

    it("exits tuple if items are not valid", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          tuple: {
            type: "tuple",
            name: "Tuple",
            items: [
              {
                type: "number",
                name: "Number",
              },
              "blah",
              /* biome-ignore lint/suspicious/noExplicitAny: */
            ] as any,
          },
        },
        required: ["tuple"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(true);

      state.tuple = "";
      expect(state).toEqual({ tuple: "" });
      expect(schema.safeParse(state).success).toBe(true);

      state.tuple = [42];
      expect(state).toEqual({ tuple: [42] });
      expect(schema.safeParse(state).success).toBe(true);
    });
  });

  describe("null", () => {
    it("supports null", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          null: {
            type: "null",
            name: "Null",
          },
        },
        required: ["null"],
      });

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
      const { state, schema } = form({
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
            nullable: true,
          },
        },
        required: ["string"],
      });

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
  });

  describe("optional", () => {
    it("supports optional", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
          },
          optional: {
            type: "string",
            name: "Optional",
          },
        },
        required: ["string"],
      });

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
  });

  describe("objects", () => {
    it("supports sub-objects", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          object: {
            type: "object",
            name: "Object",
            properties: {
              string: {
                type: "string",
                name: "String",
              },
            },
            required: ["string"],
          },
        },
        required: ["object"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.object = {};
      expect(state).toEqual({ object: {} });
      expect(schema.safeParse(state).success).toBe(false);

      state.object = { string: "test" };
      expect(state).toEqual({ object: { string: "test" } });
      expect(schema.safeParse(state).success).toBe(true);
    });

    it("supports pattern properties", () => {
      const { state, schema } = form({
        type: "object",
        properties: {
          string: {
            type: "string",
            name: "String",
          },
        },
        patternProperties: {
          "^[0-9]{3}$": {
            type: "number",
            name: "Number",
          },
          "^[a-z]{3}$": {
            type: "string",
            name: "String",
          },
          something: {
            type: "hr",
          },
        },
        required: ["string"],
      });

      expect(state).toEqual({});
      expect(schema.safeParse(state).success).toBe(false);

      state.string = 123;
      expect(state).toEqual({ string: 123 });
      expect(schema.safeParse(state).success).toBe(false);

      state.string = "test";
      expect(state).toEqual({ string: "test" });
      expect(schema.safeParse(state).success).toBe(true);

      state["123"] = "test";
      expect(state).toEqual({ string: "test", "123": "test" });
      expect(schema.safeParse(state).success).toBe(false);

      state["123"] = 99;
      expect(state).toEqual({ string: "test", "123": 99 });
      expect(schema.safeParse(state).success).toBe(true);

      state.abc = 99;
      expect(state).toEqual({ string: "test", "123": 99, abc: 99 });
      expect(schema.safeParse(state).success).toBe(false);

      state.abc = "test";
      expect(state).toEqual({ string: "test", "123": 99, abc: "test" });
      expect(schema.safeParse(state).success).toBe(true);

      state.something = "test";
      expect(state).toEqual({
        string: "test",
        "123": 99,
        abc: "test",
        something: "test",
      });
      expect(schema.safeParse(state).success).toBe(true);
    });
  });
});

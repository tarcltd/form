import { deep } from "../src/deep";

describe("deep get", () => {
  it("should get top level", () => {
    const obj = {
      test: "test",
    };

    expect(deep(obj, "test")).toEqual("test");
  });

  it("should get sub level", () => {
    const obj = {
      test: {
        another: {
          key: "test",
        },
      },
    };

    expect(deep(obj, "test.another.key")).toEqual("test");
  });

  it("should get array", () => {
    const obj = {
      test: {
        another: ["test"],
      },
    };

    expect(deep(obj, "test.another[0]")).toEqual("test");
  });

  it("should get array object", () => {
    const obj = {
      test: {
        another: [{ key: "test" }],
      },
    };

    expect(deep(obj, "test.another[0].key")).toEqual("test");
  });
});

describe("deep set", () => {
  it("should set top level", () => {
    const obj = {};

    deep(obj, "test", "test");

    expect(obj).toEqual({ test: "test" });
  });

  it("should set sub level", () => {
    const obj = {};

    deep(obj, "test.another.key", "test");

    expect(obj).toEqual({
      test: {
        another: {
          key: "test",
        },
      },
    });
  });

  it("should set array", () => {
    const obj = {};

    deep(obj, "test.another[0]", "test");

    expect(obj).toEqual({
      test: {
        another: ["test"],
      },
    });
  });

  it("should set array object", () => {
    const obj = {};

    deep(obj, "test.another[0].key", "test");

    expect(obj).toEqual({
      test: {
        another: [{ key: "test" }],
      },
    });
  });
});

import { createForm, groupReForm, nameReForm, reForm } from "../src/index";

describe("reform", () => {
  it("should output an unchanged form", () => {
    const { state, finalize } = reForm(
      createForm({
        type: "object",
        properties: {
          "main:name": {
            type: "string",
            name: "Name",
          },
          "another:email": {
            type: "string",
            name: "Email",
            format: "email",
          },
          "another:favcolor": {
            type: "string",
            name: "Favorite Color",
          },
        },
        required: ["main:name", "another:email", "another:favcolor"],
      })
    );

    state["main:name"] = "John Doe";
    state["another:email"] = "john@doe.com";
    state["another:favcolor"] = "deep purple";

    expect(finalize()).toEqual({
      'main:name': "John Doe",
      'another:email': "john@doe.com",
      'another:favcolor': "deep purple",
    });
  });

  it("should output with a field map", () => {
    const { state, finalize } = reForm(
      createForm({
        type: "object",
        properties: {
          "main:name": {
            type: "string",
            name: "Name",
          },
          "another:email": {
            type: "string",
            name: "Email",
            format: "email",
          },
          "another:favcolor": {
            type: "string",
            name: "Favorite Color",
          },
        },
        required: ["main:name", "another:email", "another:favcolor"],
      }),
      undefined,
      {
        "main:name": "name",
        "another:email": "info.email",
        "another:favcolor": "colors.favorites[0]",
      }
    );

    state["main:name"] = "John Doe";
    state["another:email"] = "john@doe.com";
    state["another:favcolor"] = "deep purple";

    expect(finalize()).toEqual({
      name: "John Doe",
      info: {
        email: "john@doe.com",
      },
      colors: {
        favorites: ["deep purple"],
      },
    });
  });

  it("should output with a partial field map", () => {
    const { state, finalize } = reForm(
      createForm({
        type: "object",
        properties: {
          "main:name": {
            type: "string",
            name: "Name",
          },
          "another:email": {
            type: "string",
            name: "Email",
            format: "email",
          },
          "another:favcolor": {
            type: "string",
            name: "Favorite Color",
          },
        },
        required: ["main:name", "another:email", "another:favcolor"],
      }),
      undefined,
      {
        "main:name": "name",
        "another:favcolor": "favorite_color",
      }
    );

    state["main:name"] = "John Doe";
    state["another:email"] = "john@doe.com";
    state["another:favcolor"] = "deep purple";

    expect(finalize()).toEqual({
      name: "John Doe",
      "another:email": "john@doe.com",
      favorite_color: "deep purple",
    });
  });

  it("should output with a specific path and transform", () => {
    const { state, finalize } = reForm(
      createForm({
        type: "object",
        properties: {
          "main:name": {
            type: "string",
            name: "Name",
          },
        },
        required: ["main:name"],
      }),
      undefined,
      {
        "main:name": {
          path: "type",
          transform: (value) => value.split("").reverse().join(""),
        },
      }
    );

    state["main:name"] = "John Doe";

    expect(finalize()).toEqual({
      gnirts: "John Doe",
    });
  });

  it("should output with a specific path", () => {
    const { state, finalize } = reForm(
      createForm({
        type: "object",
        properties: {
          "main:name": {
            type: "string",
            name: "Name",
          },
        },
        required: ["main:name"],
      }),
      undefined,
      {
        "main:name": {
          path: "type",
        },
      }
    );

    state["main:name"] = "John Doe";

    expect(finalize()).toEqual({
      string: "John Doe",
    });
  });

  it("should output with a specific path", () => {
    const { state, finalize } = reForm(
      createForm({
        type: "object",
        properties: {
          "main:name": {
            type: "string",
            name: "Name",
          },
        },
        required: ["main:name"],
      }),
      undefined,
      {
        "main:name": {
          transform: (value) => value.split("").reverse().join(""),
        },
      }
    );

    state["main:name"] = "John Doe";

    expect(finalize()).toEqual({
      "eman:niam": "John Doe",
    });
  });

  it("should output with a default path with transform", () => {
    const { state, finalize } = reForm(
      createForm({
        type: "object",
        properties: {
          "main:name": {
            type: "string",
            name: "Name",
          },
        },
        required: ["main:name"],
      }),
      {
        path: "type",
      },
      {
        "main:name": {
          transform: (value) => value.split("").reverse().join(""),
        },
      }
    );

    state["main:name"] = "John Doe";

    expect(finalize()).toEqual({
      gnirts: "John Doe",
    });
  });

  it("should output with a default transform with path", () => {
    const { state, finalize } = reForm(
      createForm({
        type: "object",
        properties: {
          "main:name": {
            type: "string",
            name: "Name",
          },
        },
        required: ["main:name"],
      }),
      {
        transform: (value) => value.split("").reverse().join(""),
      },
      {
        "main:name": {
          path: "type",
        },
      }
    );

    state["main:name"] = "John Doe";

    expect(finalize()).toEqual({
      gnirts: "John Doe",
    });
  });

  it("should output with a default transform with no path", () => {
    const { state, finalize } = reForm(
      createForm({
        type: "object",
        properties: {
          "main:name": {
            type: "string",
            name: "Name",
          },
        },
        required: ["main:name"],
      }),
      {
        path: "type",
      }
    );

    state["main:name"] = "John Doe";

    expect(finalize()).toEqual({
      string: "John Doe",
    });
  });

  it("should accept args for on-the-fly transform", () => {
    const { state, finalize } = reForm(
      createForm({
        type: "object",
        properties: {
          "main:name": {
            type: "string",
            name: "Name",
          },
        },
        required: ["main:name"],
      }),
      {
        path: "type",
      }
    );

    state["main:name"] = "John Doe";

    expect(
      finalize(undefined, {
        "main:name": "hello world",
      })
    ).toEqual({
      "hello world": "John Doe",
    });
  });

  it("should accept args for on-the-fly transform with defaults", () => {
    const { state, finalize } = reForm(
      createForm({
        type: "object",
        properties: {
          "main:name": {
            type: "string",
            name: "Name",
          },
          "another:email": {
            type: "string",
            name: "Email",
            format: "email",
          },
        },
        required: ["main:name"],
      })
    );

    state["main:name"] = "John Doe";
    state["another:email"] = "john@doe.com";

    expect(
      finalize(
        {
          path: "type",
          transform: (value) => value.toUpperCase(),
        },
        {
          "main:name": "hello world",
        }
      )
    ).toEqual({
      "hello world": "John Doe",
      STRING: "john@doe.com",
    });
  });

  it("should satisfy example in docs", () => {
    const { state, finalize } = reForm(
      createForm({
        type: "object",
        properties: {
          "main:name": {
            type: "string",
            name: "Name",
          },
          "another:email": {
            type: "string",
            name: "Email",
            format: "email",
          },
          "another:favcolor": {
            type: "string",
            name: "Favorite Color",
          },
        },
        required: ["main:name", "another:email", "another:favcolor"],
      })
    );

    state["main:name"] = "John Doe";
    state["another:email"] = "john@doe.com";
    state["another:favcolor"] = "deep purple";

    expect(
      finalize({
        path: "name",
        transform: (value) => value.toUpperCase(),
      })
    ).toEqual({
      NAME: "John Doe",
      EMAIL: "john@doe.com",
      "FAVORITE COLOR": "deep purple",
    });

    expect(
      finalize(
        {
          transform: (_, { key }) => `${key.split(":")[1]}[0]`,
        },
        {
          "main:name": "info.name",
          "another:email": "info.email",
        }
      )
    ).toEqual({
      info: {
        name: "John Doe",
        email: "john@doe.com",
      },
      favcolor: ["deep purple"],
    });
  });
});

describe("nameReForm", () => {
  it("should output a form with names as keys", () => {
    const { state, finalize } = nameReForm(
      createForm({
        type: "object",
        properties: {
          "main:name": {
            type: "string",
            name: "Name",
          },
          "another:email": {
            type: "string",
            name: "Email",
            format: "email",
          },
          "another:favcolor": {
            type: "string",
            name: "Favorite Color",
          },
        },
        required: ["main:name", "another:email", "another:favcolor"],
      })
    );

    state["main:name"] = "John Doe";
    state["another:email"] = "john@doe.com";
    state["another:favcolor"] = "deep purple";

    expect(finalize()).toEqual({
      name: "John Doe",
      email: "john@doe.com",
      favorite_color: "deep purple",
    });
  });
});

describe("groupReForm", () => {
  it("should output a form with groups", () => {
    const { state, finalize } = groupReForm(
      createForm({
        type: "object",
        properties: {
          "main:name": {
            type: "string",
            name: "Name",
          },
          "another:email": {
            type: "string",
            name: "Email",
            format: "email",
          },
          "another:favcolor": {
            type: "string",
            name: "Favorite Color",
          },
        },
        required: ["main:name", "another:email", "another:favcolor"],
      })
    );

    state["main:name"] = "John Doe";
    state["another:email"] = "john@doe.com";
    state["another:favcolor"] = "deep purple";

    expect(finalize()).toEqual({
      main: {
        name: "John Doe",
      },
      another: {
        email: "john@doe.com",
        favcolor: "deep purple",
      },
    });
  });
});

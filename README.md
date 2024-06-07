# Form

Create a JS object for use in form UI, [Zod](https://github.com/colinhacks/zod) 
schema, and various utilities, from a simple JSON object based on 
[AJV](https://github.com/ajv-validator/ajv) values in non-strict mode.

This library is compatible with any frontend framework, UI layer, and JS 
backend. It's intended for this library to be used in other libraries to easily 
create reliable forms and validation across many different frontend frameworks.

## Installation

```bash
npx jsr add @tarcltd/form
```

## Usage

```ts
import createForm from "@tarcltd/form";

const { state, schema } = createForm(
  {
    type: "object",
    properties: {
      name: {
        type: "string",
        name: "Name",
        minLength: 3,
        pattern: "\w+\s\w+",
      },
      email: {
        type: "string",
        name: "Email",
        format: "email",
        nullable: true,
      },
    },
    required: ["name", "email"],
  },
  {}, // Any JS object or framework specific reactive object
  {
    defaults: { name: "John Doe", email: "john@doe.com" },
  }
);

// `schema` is a Zod object
console.log(schema.safeParse(state).success); // true
```

## Known Issues

This library is a work in progress. Issues and PRs are welcome. 😀

- Full Zod support is not complete. We intend for the schema to support most/all
  Zod features, but we are not there yet.
- JSON schema for the input to the form factory is not available. Please rely on
  the TypeScript type definitions for the input to the form factory.

## License

MIT

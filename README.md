# Form

A form generation library for Vue 3.

## Installation

```bash
npm install @tarcltd/form
```

## Usage

```ts
import useForm from '@tarcltd/form'

const form = useForm({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
      maxLength: 10,
    },
    email: {
      type: 'email',
    },
  },
})
```

## License

MIT

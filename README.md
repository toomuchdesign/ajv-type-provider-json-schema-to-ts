# @toomuchdesign/ajv-type-provider-json-schema-to-ts

[![Build Status][ci-badge]][ci]
[![Npm version][npm-version-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

An [ajv](https://ajv.js.org/) type provider based on [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts).

```ts
import Ajv from 'ajv';
import { enhanceCompileWithTypeInference } from '@toomuchdesign/ajv-type-provider-json-schema-to-ts';

const ajv = new Ajv();
const compile = enhanceCompileWithTypeInference(ajv.compile.bind(ajv));

const schema = {
  type: 'object',
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string' },
  },
  required: ['foo'],
  additionalProperties: false,
} as const;

const validate = compile(schema);
let data: unknown = { foo: 6 };

if (validate(data)) {
  // data type inferred from schema
  console.log('Validation ok', data);
} else {
  // validate is the usual AJV validate function
  console.log('Validation ko', validate.errors);
}
```

## Installation

```
npm i @toomuchdesign/ajv-type-provider-json-schema-to-ts
```

## API

### `enhanceCompileWithTypeInference`

Enhance Ajv `compile` method with type inference:

```ts
import Ajv from 'ajv';
import { enhanceCompileWithTypeInference } from '@toomuchdesign/ajv-type-provider-json-schema-to-ts';

const ajv = new Ajv();
const compile = enhanceCompileWithTypeInference(ajv.compile.bind(ajv));
```

### `enhanceValidateWithTypeInference`

Enhance Ajv `validate` method with type inference:

```ts
import Ajv from 'ajv';
import { enhanceValidateWithTypeInference } from '@toomuchdesign/ajv-type-provider-json-schema-to-ts';

const ajv = new Ajv();
const validate = enhanceValidateWithTypeInference(ajv.validate.bind(ajv));
```

### Type provider options

`enhanceCompileWithTypeInference` and `enhanceValidateWithTypeInference` accept a [json-schema-to-ts `FromSchema` option object](https://github.com/ThomasAribart/json-schema-to-ts/blob/main/src/definitions/fromSchemaOptions.ts) to configure inferred types output:

```ts
const compile = enhanceCompileWithTypeInference<{ parseNotKeyword: true }>(
  ajv.compile.bind(ajv),
);

const validate = enhanceValidateWithTypeInference<{ parseNotKeyword: true }>(
  ajv.validate.bind(ajv),
);
```

`references` option can be used to resolve `$ref` schema types:

```ts
const userSchema = {
  $id: 'http://example.com/schemas/user.json',
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'integer' },
  },
  required: ['name', 'age'],
  additionalProperties: false,
} as const;

const usersSchema = {
  type: 'array',
  items: {
    $ref: 'http://example.com/schemas/user.json',
  },
} as const;

// Register ref schema in ajv
ajv.addSchema(userSchema);

const compile = enhanceCompileWithTypeInference<{
  // Register ref schema type provider
  references: [typeof userSchema];
}>(ajv.compile.bind(ajv));

const validate = compile(schema);

if (validate(data)) {
  // Inferred data with resolved $ref schemas
  const expectedData: { name: string; age: number }[] = data;
}
```

## Developer notes

The current API is completely decoupled from `Ajv`. This means enhancing `Ajv` methods singularly, bypassing their original type implementation.

A different approach could consist of `Ajv` exposing a hook to provide external type inference implementation, as done with [Fastify's type providers](https://fastify.dev/docs/latest/Reference/Type-Providers/):

```ts
import Ajv from 'ajv';
import type { JsonSchemaToTsProvider } from '@toomuchdesign/ajv-type-provider-json-schema-to-ts';

const ajv = new Ajv();
const typedAjv = ajv.withTypeProvider<JsonSchemaToTsProvider>();
```

## Contributing

Any contribution should be provided with a `changesets` update:

```
npx changeset
```

[ci-badge]: https://github.com/toomuchdesign/ajv-type-provider-json-schema-to-ts/actions/workflows/ci.yml/badge.svg
[ci]: https://github.com/toomuchdesign/ajv-type-provider-json-schema-to-ts/actions/workflows/ci.yml
[coveralls-badge]: https://coveralls.io/repos/github/toomuchdesign/ajv-type-provider-json-schema-to-ts/badge.svg?branch=master
[coveralls]: https://coveralls.io/github/toomuchdesign/ajv-type-provider-json-schema-to-ts?branch=master
[npm]: https://www.npmjs.com/package/@toomuchdesign/ajv-type-provider-json-schema-to-ts
[npm-version-badge]: https://img.shields.io/npm/v/@toomuchdesign/ajv-type-provider-json-schema-to-ts.svg

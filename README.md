# @toomuchdesign/ajv-type-provider-json-schema-to-ts

[![Build Status][ci-badge]][ci]
[![Npm version][npm-version-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

An [ajv](https://ajv.js.org/) type provider based on [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts).

```ts
import Ajv from 'ajv';
import { wrapAjvCompilerWithTypeProvider } from '@toomuchdesign/ajv-type-provider-json-schema-to-ts';

const ajv = new Ajv();
const compile = wrapAjvCompilerWithTypeProvider(ajv.compile.bind(ajv));

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

### `wrapAjvCompilerWithTypeProvider` options

`wrapAjvCompilerWithTypeProvider` accepts [json-schema-to-ts `FromSchema` options](https://github.com/ThomasAribart/json-schema-to-ts/blob/main/src/definitions/fromSchemaOptions.ts) to configure inferred types output:

```ts
const compile = wrapAjvCompilerWithTypeProvider<{ parseNotKeyword: true }>(
  ajv.compile.bind(ajv),
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

const compile = wrapAjvCompilerWithTypeProvider<{
  // Register ref schema type provider
  references: [typeof userSchema];
}>(ajv.compile.bind(ajv));

const validate = compile(schema);

if (validate(data)) {
  // Inferred data with resolved $ref schemas
  const expectedData: { name: string; age: number }[] = data;
}
```

### `compiler` options

The returned compiler accepts a generic which force the inferred of the returned validation function:

```ts
const compile = wrapAjvCompilerWithTypeProvider(ajv.compile.bind(ajv));
const schema = {
  type: 'object',
  properties: {
    foo: { type: 'integer' },
  },
  required: ['foo'],
} as const;
const validate = compile<{ hello: string }>(schema);
const data: unknown = { foo: 6 };

if (validate(data)) {
  // Data type forced to be equal to the provided one
  const expectedData: { hello: string } = data;
}
```

## Contributing

Any contribution should be provided with a `changesets` update:

```
npx changeset
```

## TODO

- Consider support for non-sync validators

[ci-badge]: https://github.com/toomuchdesign/ajv-type-provider-json-schema-to-ts/actions/workflows/ci.yml/badge.svg
[ci]: https://github.com/toomuchdesign/ajv-type-provider-json-schema-to-ts/actions/workflows/ci.yml
[coveralls-badge]: https://coveralls.io/repos/github/toomuchdesign/ajv-type-provider-json-schema-to-ts/badge.svg?branch=master
[coveralls]: https://coveralls.io/github/toomuchdesign/ajv-type-provider-json-schema-to-ts?branch=master
[npm]: https://www.npmjs.com/package/@toomuchdesign/ajv-type-provider-json-schema-to-ts
[npm-version-badge]: https://img.shields.io/npm/v/@toomuchdesign/ajv-type-provider-json-schema-to-ts.svg

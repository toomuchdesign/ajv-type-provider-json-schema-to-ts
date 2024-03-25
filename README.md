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
npm i json-schema-to-ts
npm i @toomuchdesign/ajv-type-provider-json-schema-to-ts
```

## Options

`@toomuchdesign/ajv-type-provider-json-schema-to-ts` accepts `json-schema-to-ts` [FromSchema options](https://github.com/ThomasAribart/json-schema-to-ts?tab=readme-ov-file#fromschema):

```ts
import Ajv from 'ajv';
import { wrapAjvCompilerWithTypeProvider } from '@toomuchdesign/ajv-type-provider-json-schema-to-ts';

const ajv = new Ajv();
const compile = wrapAjvCompilerWithTypeProvider<{ parseNotKeyword: true }>(
  ajv.compile.bind(ajv),
);
```

## Contributing

Any contribution should be provided with a `changesets` update:

```
npx changeset
```

## Contributing

- Consider support for non-sync validators

[ci-badge]: https://github.com/toomuchdesign/ajv-type-provider-json-schema-to-ts/actions/workflows/ci.yml/badge.svg
[ci]: https://github.com/toomuchdesign/ajv-type-provider-json-schema-to-ts/actions/workflows/ci.yml
[coveralls-badge]: https://coveralls.io/repos/github/toomuchdesign/ajv-type-provider-json-schema-to-ts/badge.svg?branch=master
[coveralls]: https://coveralls.io/github/toomuchdesign/ajv-type-provider-json-schema-to-ts?branch=master
[npm]: https://www.npmjs.com/package/@toomuchdesign/ajv-type-provider-json-schema-to-ts
[npm-version-badge]: https://img.shields.io/npm/v/@toomuchdesign/ajv-type-provider-json-schema-to-ts.svg

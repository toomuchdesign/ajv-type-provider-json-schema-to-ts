import { describe, it, expect, expectTypeOf } from 'vitest';
import Ajv from 'ajv';
import { enhanceCompileWithTypeInference } from '../index';

const ajv = new Ajv();

describe('enhanceCompileWithTypeInference', () => {
  describe('successful validation', () => {
    it('provides expected type guard and validator props', () => {
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
      const data: unknown = { foo: 6 };

      if (validate(data)) {
        expectTypeOf(data).toMatchTypeOf<{
          bar?: string;
          foo: number;
        }>();
      } else {
        expect.unreachable('Validation should not fail');
      }

      expect(validate.errors).toBe(null);
    });
  });

  describe('failing validation', () => {
    it('provides expected type guard and validator props', () => {
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
      const data: unknown = { foo: 'wrong' };

      if (validate(data)) {
        expect.unreachable('Validation should not pass');
      } else {
        expectTypeOf(data).toBeUnknown();
      }

      expect(validate.errors).toEqual([
        {
          instancePath: '/foo',
          keyword: 'type',
          message: 'must be integer',
          params: {
            type: 'integer',
          },
          schemaPath: '#/properties/foo/type',
        },
      ]);
    });
  });

  describe('1st generic argument', () => {
    it('accepts json-schema-to-ts FromSchema options and customizes type inference', () => {
      const compile = enhanceCompileWithTypeInference<{
        parseNotKeyword: true;
      }>(ajv.compile.bind(ajv));
      const schema = {
        type: 'array',
        items: [{ const: 1 }, { const: 2 }],
        additionalItems: false,
        minItems: 2,
        not: {
          const: [1],
        },
      } as const;

      const validate = compile(schema);
      const data: unknown = [1, 2];

      if (validate(data)) {
        expectTypeOf(data).toMatchTypeOf<[] | [1, 2]>();
      } else {
        expect.unreachable('Validation should not fail');
      }
    });
  });

  it('resolves $refs with json-schema-to-ts FromSchema "references" option', () => {
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
      // Register ref schema in type provider
      references: [typeof userSchema];
    }>(ajv.compile.bind(ajv));

    const validate = compile(usersSchema);
    const data: unknown = [
      { name: 'foo', age: 3 },
      { name: 'bar', age: 4 },
    ];

    if (validate(data)) {
      expectTypeOf(data).toMatchTypeOf<{ name: string; age: number }[]>();
    } else {
      expect.unreachable('Validation should not fail');
    }
  });

  describe('"compile" 1st generic argument', () => {
    it('accepts forced inferred type', () => {
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

      const validate = compile<{ hello: string }>(schema);
      const data: unknown = { foo: 6 };

      if (validate(data)) {
        expectTypeOf(data).toMatchTypeOf<{ hello: string }>();
      } else {
        expect.unreachable('Validation should not fail');
      }
    });
  });
});

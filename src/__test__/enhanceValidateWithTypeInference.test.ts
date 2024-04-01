import { describe, it, expect, expectTypeOf } from 'vitest';
import Ajv from 'ajv';
import { enhanceValidateWithTypeInference } from '../index';

const ajv = new Ajv();

describe('enhanceValidateWithTypeInference', () => {
  describe('successful validation', () => {
    it('provides expected type guard and validator props', () => {
      const validate = enhanceValidateWithTypeInference(ajv.validate.bind(ajv));
      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'integer' },
          bar: { type: 'string' },
        },
        required: ['foo'],
        additionalProperties: false,
      } as const;

      const data: unknown = { foo: 6 };

      if (validate(schema, data)) {
        expectTypeOf(data).toMatchTypeOf<{
          bar?: string;
          foo: number;
        }>();
      } else {
        expect.unreachable('Validation should not fail');
      }

      expect(ajv.errors).toBe(null);
    });
  });

  describe('failing validation', () => {
    it('provides expected type guard and validator props', () => {
      const validate = enhanceValidateWithTypeInference(ajv.validate.bind(ajv));
      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'integer' },
          bar: { type: 'string' },
        },
        required: ['foo'],
        additionalProperties: false,
      } as const;

      const data: unknown = { foo: 'wrong' };

      if (validate(schema, data)) {
        expect.unreachable('Validation should not pass');
      } else {
        expectTypeOf(data).toBeUnknown();
      }

      expect(ajv.errors).toEqual([
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
      const validate = enhanceValidateWithTypeInference<{
        parseNotKeyword: true;
      }>(ajv.validate.bind(ajv));
      const schema = {
        type: 'array',
        items: [{ const: 1 }, { const: 2 }],
        additionalItems: false,
        minItems: 2,
        not: {
          const: [1],
        },
      } as const;

      const data: unknown = [1, 2];

      if (validate(schema, data)) {
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

    const validate = enhanceValidateWithTypeInference<{
      // Register ref schema in type provider
      references: [typeof userSchema];
    }>(ajv.validate.bind(ajv));

    const data: unknown = [
      { name: 'foo', age: 3 },
      { name: 'bar', age: 4 },
    ];

    if (validate(usersSchema, data)) {
      expectTypeOf(data).toMatchTypeOf<{ name: string; age: number }[]>();
    } else {
      expect.unreachable('Validation should not fail');
    }
  });

  describe('"validate" 1st generic argument', () => {
    it('accepts forced inferred type', () => {
      const validate = enhanceValidateWithTypeInference(ajv.validate.bind(ajv));
      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'integer' },
          bar: { type: 'string' },
        },
        required: ['foo'],
        additionalProperties: false,
      } as const;

      const data: unknown = { foo: 6 };

      if (validate<{ hello: string }>(schema, data)) {
        expectTypeOf(data).toMatchTypeOf<{ hello: string }>();
      } else {
        expect.unreachable('Validation should not fail');
      }
    });
  });
});

import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';
import { wrapAjvCompilerWithTypeProvider } from '../index';

const ajv = new Ajv();

const schema = {
  type: 'object',
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string' },
  },
  required: ['foo'],
  additionalProperties: false,
} as const;

describe('wrapAjvCompilerWithTypeProvider', () => {
  describe('successful validation', () => {
    it('provides expected type guard and validator props', () => {
      const compile = wrapAjvCompilerWithTypeProvider((schema) =>
        ajv.compile(schema),
      );
      const validate = compile(schema);
      const data: unknown = { foo: 6 };

      if (validate(data)) {
        const expectedData: { foo: number; bar?: string } = data;
        expect(expectedData).toEqual(data);
      } else {
        expect.unreachable('Validation should not fail');
      }

      expect(validate.errors).toBe(null);
    });
  });

  describe('failing validation', () => {
    it('provides expected type guard and validator props', () => {
      const compile = wrapAjvCompilerWithTypeProvider((schema) =>
        ajv.compile(schema),
      );
      const validate = compile(schema);
      const data: unknown = { foo: 'wrong' };

      if (validate(data)) {
        expect.unreachable('Validation should not pass');
      } else {
        const expectedData: unknown = data;
        expect(expectedData).toEqual(data);
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

  it('accepts json-schema-to-ts FromSchema options', () => {
    const compile = wrapAjvCompilerWithTypeProvider<{ parseNotKeyword: true }>(
      (schema) => ajv.compile(schema),
    );
    const schema = {
      type: 'array',
      items: [{ const: 1 }, { const: 2 }],
      additionalItems: false,
      not: {
        const: [1],
      },
    } as const;

    const validate = compile(schema);
    const data: unknown = [1, 2];

    if (validate(data)) {
      const expectedData: [] | [1, 2] = data;
      expect(expectedData).toEqual(data);
    } else {
      expect.unreachable('Validation should not fail');
    }
  });
});

import type {
  FromSchema,
  FromSchemaDefaultOptions,
  FromSchemaOptions,
  JSONSchema,
} from 'json-schema-to-ts';
import type { ValidateFunction } from 'ajv';

export const wrapAjvCompilerWithTypeProvider =
  <FromSchemaUserOptions extends FromSchemaOptions = FromSchemaDefaultOptions>(
    compiler: <Data = unknown>(schema: JSONSchema) => ValidateFunction<Data>,
  ) =>
  <Schema extends JSONSchema, Data = FromSchema<Schema, FromSchemaUserOptions>>(
    schema: Schema,
  ): ValidateFunction<Data> => {
    return compiler<Data>(schema);
  };

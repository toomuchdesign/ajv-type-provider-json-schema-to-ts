import type {
  FromSchema,
  FromSchemaDefaultOptions,
  FromSchemaOptions,
  JSONSchema,
} from 'json-schema-to-ts';
import type { ValidateFunction } from 'ajv';

type Compiler = <Data = unknown>(
  schema: JSONSchema,
  _meta?: boolean,
) => ValidateFunction<Data>;

export const wrapAjvCompilerWithTypeProvider =
  <FromSchemaUserOptions extends FromSchemaOptions = FromSchemaDefaultOptions>(
    compiler: Compiler,
  ) =>
  <Schema extends JSONSchema, Data = FromSchema<Schema, FromSchemaUserOptions>>(
    schema: Schema,
  ): ValidateFunction<Data> => {
    return compiler<Data>(schema);
  };

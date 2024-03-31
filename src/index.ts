import type {
  FromSchema,
  FromSchemaDefaultOptions,
  FromSchemaOptions,
  JSONSchema,
} from 'json-schema-to-ts';
import type { ValidateFunction } from 'ajv';

type Compile = <Data = unknown>(
  schema: JSONSchema,
  _meta?: boolean,
) => ValidateFunction<Data>;

export const wrapAjvCompileWithTypeProvider =
  <FromSchemaUserOptions extends FromSchemaOptions = FromSchemaDefaultOptions>(
    compiler: Compile,
  ) =>
  <
    ForcedData = void,
    Schema extends JSONSchema = {},
    Data = ForcedData extends void
      ? FromSchema<Schema, FromSchemaUserOptions>
      : ForcedData,
  >(
    schema: Schema,
  ): ValidateFunction<Data> => {
    return compiler<Data>(schema);
  };

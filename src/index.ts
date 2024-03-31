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
    Data = void,
    Schema extends JSONSchema = {},
    InferredData = Data extends void
      ? FromSchema<Schema, FromSchemaUserOptions>
      : Data,
  >(
    schema: Schema,
  ): ValidateFunction<InferredData> => {
    return compiler(schema);
  };

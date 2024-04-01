import type {
  FromSchema,
  FromSchemaDefaultOptions,
  FromSchemaOptions,
  JSONSchema,
} from 'json-schema-to-ts';
import type { ValidateFunction, Schema } from 'ajv';

/**
 * We should use `Ajv['compile']` type, here but sometimes TS seems to raise the following error:
 * Type instantiation is excessively deep and possibly infinite.ts(2589)
 */
type Compile = <Data = unknown>(
  schema: Schema,
  _meta?: boolean,
) => ValidateFunction<Data>;

export const enhanceCompileWithTypeInference =
  <FromSchemaUserOptions extends FromSchemaOptions = FromSchemaDefaultOptions>(
    compile: Compile,
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
    return compile(schema);
  };

/**
 * We should use `Ajv['validate']` type, here but sometimes TS seems to raise the following error:
 * Type instantiation is excessively deep and possibly infinite.ts(2589)
 */
type Validate = (schema: Schema, data: unknown) => boolean;

export const enhanceValidateWithTypeInference =
  <FromSchemaUserOptions extends FromSchemaOptions = FromSchemaDefaultOptions>(
    validate: Validate,
  ) =>
  <
    Data = void,
    Schema extends JSONSchema = {},
    InferredData = Data extends void
      ? FromSchema<Schema, FromSchemaUserOptions>
      : Data,
  >(
    schema: Schema,
    data: unknown,
  ): data is InferredData => {
    return validate(schema, data);
  };

import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import {
  defaultFieldResolver,
  GraphQLError,
  GraphQLSchema,
  GraphQLScalarType,
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
  ValueNode,
  Kind,
} from 'graphql';

type ValidationType = 'input' | 'output';
export function isNotEmptyDirectiveTransformer(
  schema: GraphQLSchema,
): GraphQLSchema {
  const directiveName: string = 'isNotEmpty';
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      return applyDirectiveToOutputField(fieldConfig, schema, directiveName);
    },

    [MapperKind.INPUT_OBJECT_FIELD]: (inputFieldConfig) => {
      return applyDirectiveToInputField(
        inputFieldConfig,
        schema,
        directiveName,
      );
    },
  });
}

function applyDirectiveToOutputField(
  fieldConfig: GraphQLFieldConfig<any, any>,
  schema: GraphQLSchema,
  directiveName: string,
): GraphQLFieldConfig<any, any> {
  const directive = getDirective(schema, fieldConfig, directiveName)?.[0];

  if (!directive) {
    return fieldConfig;
  }

  const { resolve = defaultFieldResolver } = fieldConfig;

  fieldConfig.resolve = async (source, args, context, info) => {
    const result = await resolve(source, args, context, info);
    validateNotEmpty(result, info.fieldName, 'output');
    return result;
  };

  return fieldConfig;
}

function applyDirectiveToInputField(
  fieldConfig: GraphQLInputFieldConfig,
  schema: GraphQLSchema,
  directiveName: string,
): GraphQLInputFieldConfig {
  const directive = getDirective(schema, fieldConfig, directiveName)?.[0];

  if (!directive) {
    return fieldConfig;
  }

  const fieldName = fieldConfig.astNode?.name?.value || 'field';

  fieldConfig.type = new GraphQLScalarType({
    name: 'NotEmptyString',
    description: `${fieldName} must not be empty`,
    serialize: (value) => value,
    parseValue: (value) => {
      validateNotEmpty(value, fieldName, 'input');
      return value;
    },
    parseLiteral: (ast: ValueNode) => {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`Field '${fieldName}' must be a string`);
      }

      validateNotEmpty(ast.value, fieldName, 'input');
      return ast.value;
    },
  });

  return fieldConfig;
}

function validateNotEmpty(
  value: unknown,
  fieldName: string,
  type: ValidationType,
): void {
  const isEmpty =
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '');

  if (isEmpty) {
    throw new GraphQLError(
      `Field '${fieldName}' cannot be empty (${type} validation)`,
    );
  }
}

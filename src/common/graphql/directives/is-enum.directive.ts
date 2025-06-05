// is-enum.directive.ts
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import {
  defaultFieldResolver,
  GraphQLError,
  GraphQLSchema,
  GraphQLScalarType,
  Kind,
} from 'graphql';
import { getEnumTypeByName } from './enum.registry';

type ValidationType = 'input' | 'output';
export function isEnumDirectiveTransformer(schema: GraphQLSchema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, 'isEnum')?.[0];
      if (directive) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async (source, args, context, info) => {
          const result = await resolve(source, args, context, info);
          validateEnum(
            result as string,
            directive.enumType,
            info.fieldName,
            'output',
          );
          return result;
        };
      }
      return fieldConfig;
    },

    [MapperKind.INPUT_OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, 'isEnum')?.[0];
      if (directive) {
        fieldConfig.type = new GraphQLScalarType({
          name: 'EnumValidatedString',
          serialize: (value) => value,
          parseValue: (value) => {
            validateEnum(
              value as string,
              directive.enumType,
              fieldConfig.astNode?.name?.value || 'field',
              'input',
            );
            return value;
          },
          parseLiteral: (ast) => {
            if (ast.kind !== Kind.STRING) {
              throw new GraphQLError(`Field must be a string`);
            }
            validateEnum(
              ast.value,
              directive.enumType,
              fieldConfig.astNode?.name?.value || 'field',
              'input',
            );
            return ast.value;
          },
        });
      }
      return fieldConfig;
    },
  });
}

function validateEnum(
  value: string,
  enumTypeName: string,
  fieldName: string,
  validationType: ValidationType,
): void {
  const enumType: Record<string, string> = getEnumTypeByName(enumTypeName);
  if (!enumType) {
    throw new GraphQLError(`Enum type '${enumTypeName}' not found`);
  }
  if (!Object.values(enumType).includes(value)) {
    throw new GraphQLError(
      `Field '${fieldName}' must be one of: ${Object.values(enumType).join(', ')} (${validationType} validation)`,
    );
  }
}

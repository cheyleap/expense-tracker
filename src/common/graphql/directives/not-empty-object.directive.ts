import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import {
  defaultFieldResolver,
  GraphQLError,
  GraphQLScalarType,
  GraphQLSchema,
  Kind,
  ObjectValueNode,
  ValueNode,
} from 'graphql';

export function nonEmptyObjectDirectiveTransformer(
  schema: GraphQLSchema,
): GraphQLSchema {
  const directiveName: string = 'nonEmptyObject';
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, directiveName)?.[0];

      if (!directive) {
        return fieldConfig;
      }

      const { resolve = defaultFieldResolver } = fieldConfig;

      fieldConfig.resolve = async (source, args, context, info) => {
        const result = await resolve(source, args, context, info);
        validateObject(result, info.fieldName);
        return result;
      };

      return fieldConfig;
    },

    [MapperKind.INPUT_OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, directiveName)?.[0];

      if (!directive) {
        return fieldConfig;
      }

      const fieldName = fieldConfig.astNode?.name?.value || 'field';

      fieldConfig.type = new GraphQLScalarType({
        name: 'NonEmptyObject',
        description: `${fieldName} must not be empty`,
        serialize: (value) => value,
        parseValue: (value) => {
          validateObject(value, fieldName);
          return value;
        },
        parseLiteral: (ast: ValueNode) => {
          if (ast.kind !== Kind.OBJECT) {
            throw new GraphQLError(`Field '${fieldName}' must be an object`);
          }

          const objectNode = ast as ObjectValueNode;
          if (objectNode.fields.length === 0) {
            throw new GraphQLError(
              `Field '${fieldName}' cannot be an empty object`,
            );
          }

          const parsedObject = objectNode.fields.reduce((obj, field) => {
            obj[field.name.value] =
              field.value.kind === Kind.STRING
                ? (field.value as any).value
                : field.value;
            return obj;
          }, {});

          validateObject(parsedObject, fieldName);

          return parsedObject;
        },
      });

      return fieldConfig;
    },
  });
}

function validateObject(value: any, fieldName: string): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new GraphQLError(`Field '${fieldName}' must be a valid object`);
  }

  if (Object.keys(value).length === 0) {
    throw new GraphQLError(`Field '${fieldName}' cannot be an empty object`);
  }

  for (const key of Object.keys(value)) {
    if (
      value[key] === null ||
      value[key] === undefined ||
      (typeof value[key] === 'string' && value[key].trim() === '')
    ) {
      throw new GraphQLError(
        `Property '${key}' in object '${fieldName}' cannot be empty`,
      );
    }
  }
}

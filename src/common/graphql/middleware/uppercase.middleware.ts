import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const uppercaseMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const value = await next();
  return typeof value === 'string' ? value.toUpperCase() : value;
};

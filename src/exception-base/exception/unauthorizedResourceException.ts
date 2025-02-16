import { AbstractUnauthorizedException } from '../abstraction/abstraction-resource-unauthorized.exception';

export class UnauthorizedResourceException extends AbstractUnauthorizedException {
  constructor(message?: string) {
    super(message);
  }
}

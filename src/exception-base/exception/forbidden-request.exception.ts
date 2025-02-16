import { AbstractResourceForbiddenException } from '../abstraction/abstract-resource-forbidden.request.exception';

export class ForbiddenRequestException extends AbstractResourceForbiddenException {
  constructor(path?: string, message?: string) {
    super(path, message);
  }
}

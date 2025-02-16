import { AbstractResourceBadRequestException } from '../abstraction/abstract-resource-bad-request.exception';

export class ResourceBadRequestException extends AbstractResourceBadRequestException {
  constructor(path: string, message: string) {
    super(path, message);
  }
}

import { AbstractConflictResourceException } from '../abstraction/abstract-resource-conflict.exception';

export class ResourceConflictException extends AbstractConflictResourceException {
  constructor(path?: string, message?: string) {
    super(path, message);
  }
}

import { AbstractResourceNotFoundException } from '../abstraction/abstract-resource-not-found.exception';

export class ResourceNotFoundException extends AbstractResourceNotFoundException {
  constructor(resource: string, errorMessage: string | number) {
    super(resource, errorMessage);
  }
}

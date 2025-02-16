import { AbstractBaseException } from './abstract-base.exception';
import { HttpMessage } from '../../common/enums/http-message.enum';
import { ResourceNotfoundExceptionMessage } from '../exception-template';

export abstract class AbstractResourceNotFoundException extends AbstractBaseException {
  protected constructor(
    readonly resource: string,
    readonly errorMessage: string | number,
  ) {
    super(HttpMessage.NOT_FOUND);
  }

  getError(): ResourceNotfoundExceptionMessage[] {
    const message =
      this.resource && this.errorMessage
        ? `Resource ${this.resource} of ${this.errorMessage} not found.`
        : this.resource || HttpMessage.NOT_FOUND;

    return [{ message }];
  }
}

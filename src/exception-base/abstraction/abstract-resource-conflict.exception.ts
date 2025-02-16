import { AbstractBaseException } from './abstract-base.exception';
import { HttpMessage } from '../../common/enums/http-message.enum';
import { ResourceConflictExceptionMessage } from '../exception-template';

export abstract class AbstractConflictResourceException extends AbstractBaseException {
  protected constructor(
    readonly path: string,
    readonly message: string = 'Data already exists.',
  ) {
    super(HttpMessage.CONFLICT);
  }

  getError(): ResourceConflictExceptionMessage[] {
    return [
      {
        path: this.path,
        message: this.message,
      },
    ];
  }
}

import { AbstractBaseException } from './abstract-base.exception';
import { ForbiddenExceptionMessage } from '../exception-template';
import { HttpMessage } from '../../common/enums/http-message.enum';

export abstract class AbstractResourceForbiddenException extends AbstractBaseException {
  protected constructor(
    readonly message: string = 'You are not allowed to access this resource.',
    readonly path: string,
  ) {
    super(HttpMessage.FORBIDDEN);
  }

  getError(): ForbiddenExceptionMessage[] {
    return [
      {
        message: this.message ?? this.path ?? HttpMessage.FORBIDDEN,
      },
    ];
  }
}

import { AbstractBaseException } from './abstract-base.exception';
import { HttpMessage } from '../../common/enums/http-message.enum';
import { UnauthorizedExceptionMessage } from '../exception-template';

export abstract class AbstractUnauthorizedException extends AbstractBaseException {
  protected constructor(readonly message: string = HttpMessage.UNAUTHORIZED) {
    super(HttpMessage.UNAUTHORIZED);
  }

  getError(): UnauthorizedExceptionMessage[] {
    return [{ message: this.message }];
  }
}

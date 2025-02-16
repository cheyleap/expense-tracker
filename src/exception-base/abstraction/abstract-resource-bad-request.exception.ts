import { AbstractBaseException } from './abstract-base.exception';
import { HttpMessage } from '../../common/enums/http-message.enum';
import { BadRequestExceptionMessage } from '../exception-template';

export abstract class AbstractResourceBadRequestException extends AbstractBaseException {
  protected constructor(
    readonly path: string,
    readonly message: string,
  ) {
    super(HttpMessage.BAD_REQUEST);
  }

  getError(): BadRequestExceptionMessage[] {
    return [{ path: this.path, message: this.message }];
  }
}

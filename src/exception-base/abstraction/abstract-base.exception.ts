import { ExceptionTemplate } from '../exception-template';

export abstract class AbstractBaseException extends Error {
  protected constructor(readonly message: string) {
    super(message);
  }

  abstract getError(): ExceptionTemplate[];
}

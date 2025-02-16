export interface UnauthorizedExceptionMessage {
  message: string;
}

export interface ResourceNotfoundExceptionMessage {
  message: string;
}

export interface ResourceConflictExceptionMessage {
  message: string;
  path: string;
}

export interface ForbiddenExceptionMessage {
  message: string;
}

export interface InternalServerErrorMessage {
  message: string;
}

export interface RequestTimeoutExceptionMessage {
  message: string;
}

export interface ValidationErrorExceptionMessage {
  path: string;
  message: string;
}

export interface BadRequestExceptionMessage {
  path: string;
  message: string;
}

export type ExceptionTemplate =
  | UnauthorizedExceptionMessage
  | ResourceNotfoundExceptionMessage
  | ResourceConflictExceptionMessage
  | ForbiddenExceptionMessage
  | InternalServerErrorMessage
  | RequestTimeoutExceptionMessage
  | ValidationErrorExceptionMessage
  | BadRequestExceptionMessage;

import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResourceNotFoundException } from '../exception/not-found.exception';
import { UnauthorizedResourceException } from '../exception/unauthorizedResourceException';
import { ResourceBadRequestException } from '../exception/bad-request.exception';
import { QueryFailedError } from 'typeorm';
import { PostgresqlStatusCode } from '../../common/enums/postgres-code.enum';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    const errors = [];
    console.log(exception);
    if (exception instanceof UnauthorizedException) {
      message = exception.message;
      errors.push('Unauthorized request.');
    } else if (exception instanceof BadRequestException) {
      status = exception.getStatus();
      message = 'Validation error';
      errors.push(...this.extractValidationErrors(exception));
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (
      exception instanceof ResourceNotFoundException ||
      exception instanceof UnauthorizedResourceException ||
      exception instanceof ResourceBadRequestException
    ) {
      message = exception.message;
      errors.push(exception.getError());
    } else if (exception instanceof QueryFailedError) {
      const { code, detail, column } = exception.driverError;

      switch (code) {
        case PostgresqlStatusCode.UNIQUE_VIOLATION:
          const customErrorMessage: { path: string; message: string } =
            this.customDuplicateErrorMessage(detail, request.body);
          this.handleConflict(response, customErrorMessage);
          return;

        case PostgresqlStatusCode.INVALID_TEXT_REPRESENTATION:
          this.handleBadRequest(response, exception.message);
          return;

        case PostgresqlStatusCode.FOREIGN_KEY_VIOLATION:
          this.handleBadRequest(
            response,
            'You cannot delete data because this record has been used by another record.',
          );
          return;

        case PostgresqlStatusCode.UNDEFINED_COLUMN:
          this.handleBadRequest(response, exception.message);
          return;

        case PostgresqlStatusCode.NOT_NULL_VIOLATION:
          this.handleBadRequest(
            response,
            `Field '${column}' should not be null!`,
          );
          return;
      }
    }

    if (errors.length === 0) {
      errors.push({
        message:
          'Oops! Something went wrong, please contact the administrator.',
      });
    }

    response.status(status).json({ message, errors });
  }

  private extractValidationErrors(exception: BadRequestException) {
    const errors = [];
    const response = exception.getResponse() as any;
    if (Array.isArray(response?.message)) {
      response.message.forEach((error) => {
        if (error.property && error.constraints) {
          Object.values(error.constraints).forEach((constraint) => {
            errors.push({ path: error.property, message: constraint });
          });
        }
      });
    } else {
      errors.push({ message: response.message || exception.message });
    }
    return errors;
  }

  private handleErrorResponse(
    response: any,
    status: number,
    message: string,
    errors: { message: string }[],
  ): void {
    response.status(status).json({ message, errors });
  }

  private handleBadRequest(response: any, errorMessage: string): void {
    const errors: { message: string }[] = [{ message: errorMessage }];
    this.handleErrorResponse(
      response,
      HttpStatus.BAD_REQUEST,
      'Bad Request',
      errors,
    );
  }

  private handleConflict(response: any, errorMessage: any): void {
    const errors: { message: string }[] = [{ message: errorMessage }];
    this.handleErrorResponse(
      response,
      HttpStatus.CONFLICT,
      'Resource conflict error',
      errors,
    );
  }

  private customDuplicateErrorMessage(message: string, requestBody: any) {
    if (typeof message !== 'string' || !message.includes('already exists')) {
      return null;
    }
    const messageStart: string = 'Data already exists.';
    const columnPath: string = this.extractColumns(message, requestBody);
    return {
      path: columnPath,
      message: messageStart,
    };
  }

  private extractColumns(message: string, requestBody: any) {
    const match: RegExpMatchArray = message.match(/\(([^)]+)\)=\(([^)]+)\)/);
    if (match) {
      return this.snakeToCamel(match[1])
        .split(',')
        .map((key: string, index: number) => {
          const value: string[] = match[2].split(',');
          return this.extractRequestPath(
            requestBody,
            key.trim(),
            value.at(index).trim(),
          );
        })
        .join(',');
    }
    return null;
  }

  private snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  private extractRequestPath(
    data: any,
    key: string,
    value: string,
    pathPrefix: string = '',
  ): string | null {
    if (data instanceof Array) {
      for (let i = 0; i < data.length; i++) {
        const path = this.extractRequestPath(
          data[i],
          key,
          value,
          `${pathPrefix}[${i}]`,
        );
        if (path) return path;
      }
    } else if (data instanceof Object) {
      for (const prop in data) {
        if (data.hasOwnProperty(prop)) {
          if (prop === key && data[prop] == value) {
            return `${pathPrefix ? pathPrefix + '.' : ''}${prop}`;
          }
          const path = this.extractRequestPath(
            data[prop],
            key,
            value,
            `${pathPrefix ? pathPrefix + '.' : ''}${prop}`,
          );
          if (path) return path;
        }
      }
    }
    return null;
  }
}

import { Request, Response } from 'express';

let userId: number;

export class RequestContext {
  readonly response: Response;
  readonly request: Request;

  constructor(request: Request, response: Response) {
    this.response = response;
    this.request = request;
    userId = request['user']['id'];
  }

  public static currentUser(): number {
    return userId;
  }
}

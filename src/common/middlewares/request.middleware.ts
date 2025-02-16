import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../user/repository/user.interface.repository';
import { UserRepositoryImpl } from '../../user/repository/user.repository';
import { RequestContext } from './request';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(UserRepositoryImpl)
    private readonly userRepository: UserRepository,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token: string = authHeader.split(' ')[1];
      try {
        const decoded: any = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });
        req['user'] = await this.userRepository.findOneById(decoded.id);
        new RequestContext(req, res);
      } catch (error) {
        console.error(error);
      }
    }
    next();
  }
}

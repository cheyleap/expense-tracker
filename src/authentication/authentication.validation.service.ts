import { UserRepository } from '../user/repository/user.interface.repository';
import { Inject } from '@nestjs/common';
import { UserRepositoryImpl } from '../user/repository/user.repository';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedResourceException } from '../exception-base/exception/unauthorizedResourceException';

export class AuthenticationValidationService {
  constructor(
    @Inject(UserRepositoryImpl) private readonly userRepository: UserRepository,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: [{ email: username }, { username }],
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedResourceException();
    }
    return user;
  }

  async validateUserById(userId: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: userId },
    });
  }
}

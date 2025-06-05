import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repository/user.interface.repository';
import { UserRepositoryImpl } from './repository/user.repository';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { UserQueryDto } from './dto/user-query.dto';
import { PaginationResponse } from '../common/interfaces/response.interface';

@Injectable()
export class UserService {
  private readonly SALT_ROUND: number = 10;

  constructor(
    @Inject(UserRepositoryImpl) private readonly userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Extract user data from the data field
    const { username, email, password, phone } = createUserDto.data;

    const user: User = await this.userRepository.create({
      username,
      email,
      password: await this.hashPassword(password),
      phone,
    });
    return this.userRepository.create(user);
  }

  findAll(queryDto: UserQueryDto): Promise<PaginationResponse<User>> {
    return this.userRepository.findWithPagination(queryDto, [
      'username',
      'email',
      'phone',
    ]);
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneById(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = await this.findOne(id);
    user.password = this.hashPassword(updateUserDto.password);
    return await this.userRepository.update(user);
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    this.userRepository.softDelete(id);
  }

  private hashPassword(password: string): any {
    return bcrypt.hash(password, this.SALT_ROUND);
  }
}

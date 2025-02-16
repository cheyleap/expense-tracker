import { BaseRepositoryService } from '../../common/entity/base-repository-impl';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.interface.repository';

@Injectable()
export class UserRepositoryImpl
  extends BaseRepositoryService<User>
  implements UserRepository
{
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }
}

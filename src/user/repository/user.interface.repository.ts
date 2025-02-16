import { BaseRepository } from '../../common/entity/base-repository';
import { User } from '../entities/user.entity';

export interface UserRepository extends BaseRepository<User> {}

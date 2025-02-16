import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepositoryImpl } from './repository/user.repository';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepositoryImpl],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UserService, UserRepositoryImpl],
})
export class UserModule {}

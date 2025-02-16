import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { UserRepositoryImpl } from '../user/repository/user.repository';
import { AuthenticationValidationService } from './authentication.validation.service';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  controllers: [AuthenticationController],
  providers: [
    UserRepositoryImpl,
    AuthenticationService,
    AuthenticationValidationService,
    JwtStrategy,
  ],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRE,
        },
      }),
    }),
  ],
})
export class AuthenticationModule {}

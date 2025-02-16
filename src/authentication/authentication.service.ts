import { Injectable } from '@nestjs/common';
import { AuthenticationValidationService } from './authentication.validation.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly authenticationValidationService: AuthenticationValidationService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ username, password }: LoginDto): Promise<LoginResponseDto> {
    const user: User = await this.authenticationValidationService.validateUser(
      username,
      password,
    );
    const jwtExpiresIn: string = process.env.JWT_EXPIRE;
    return this.generateToken(user, jwtExpiresIn);
  }

  async getRefreshToken(token: string): Promise<LoginResponseDto> {
    const decodedPayload: any = this.jwtService.decode(token);
    const user: User =
      await this.authenticationValidationService.validateUserById(
        decodedPayload.id,
      );
    return this.generateToken(user);
  }

  private generateToken(
    user: User,
    expireIn?: string | number,
  ): LoginResponseDto {
    const payload = { id: user.id, username: user.username, email: user.email };
    return new LoginResponseDto(
      this.jwtService.sign(payload),
      this.jwtService.sign(payload, {
        expiresIn: expireIn ?? process.env.JWT_REFRESH_EXPIRES_IN,
      }),
    );
  }
}

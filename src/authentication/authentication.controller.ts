import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedResourceException } from '../exception-base/exception/unauthorizedResourceException';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/login')
  @ApiOkResponse({ type: LoginResponseDto })
  login(@Body() loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
  }

  @Post('/refresh-token')
  @ApiOkResponse({ type: LoginResponseDto })
  refreshToken(@Headers('Authorization') bearerToken: string) {
    const token: string[] = bearerToken.split(' ');
    if (token.length !== 2) {
      throw new UnauthorizedResourceException();
    }
    return this.authenticationService.getRefreshToken(token.at(1));
  }
}

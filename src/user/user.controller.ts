import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMappingInterceptor } from '../common/interceptors/request-mapping-response.interceptor';
import { IdResponseDto } from '../common/dto/api-id-reponse.dto';
import { getPaginationResponseDto } from '../common/utils/get-pagination-response';
import { User } from './entities/user.entity';
import { UserQueryDto } from './dto/user-query.dto';

@ApiBearerAuth()
@ApiTags('transaction')
@Controller('user')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ResponseMappingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ type: IdResponseDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiResponse({ status: 201, type: getPaginationResponseDto(User) })
  findAll(@Query() queryDto: UserQueryDto) {
    return this.userService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: User })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ type: IdResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}

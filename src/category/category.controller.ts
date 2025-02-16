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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
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
import { getPaginationResponseDto } from '../common/utils/get-pagination-response.util';
import { CategoryQueryDto } from './dto/category-query.dto';
import { Category } from './entities/category.entity';

@ApiBearerAuth()
@ApiTags('category')
@Controller('category')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ResponseMappingInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOkResponse({ type: IdResponseDto })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiResponse({ status: 201, type: getPaginationResponseDto(Category) })
  findAll(@Query() queryDto: CategoryQueryDto) {
    return this.categoryService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: Category })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: CreateCategoryDto })
  @ApiOkResponse({ type: IdResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.delete(id);
  }
}

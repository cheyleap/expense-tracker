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
import { BudgetLimitService } from './budget-limit.service';
import { CreateBudgetLimitDto } from './dto/create-budget-limit.dto';
import { UpdateBudgetLimitDto } from './dto/update-budget-limit.dto';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMappingInterceptor } from '../common/interceptors/request-mapping-response.interceptor';
import { BudgetLimitQueryDto } from './dto/budget-limit-query.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IdResponseDto } from '../common/dto/api-id-reponse.dto';
import { BudgetLimit } from './entities/budget-limit.entity';
import { getPaginationResponseDto } from '../common/utils/get-pagination-response';

@ApiBearerAuth()
@ApiTags('budget-limit')
@Controller('budget-limit')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ResponseMappingInterceptor)
export class BudgetLimitController {
  constructor(private readonly budgetLimitService: BudgetLimitService) {}

  @Post()
  @ApiBody({ type: CreateBudgetLimitDto })
  @ApiOkResponse({ type: IdResponseDto })
  create(@Body() createBudgetLimitDto: CreateBudgetLimitDto) {
    return this.budgetLimitService.create(createBudgetLimitDto);
  }

  @Get()
  @ApiResponse({ status: 201, type: getPaginationResponseDto(BudgetLimit) })
  findAll(@Query() queryDto: BudgetLimitQueryDto) {
    return this.budgetLimitService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: BudgetLimit })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.budgetLimitService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: CreateBudgetLimitDto })
  @ApiOkResponse({ type: IdResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBudgetLimitDto: UpdateBudgetLimitDto,
  ) {
    return this.budgetLimitService.update(id, updateBudgetLimitDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.budgetLimitService.delete(id);
  }
}

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
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
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
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { Transaction } from './entities/transaction.entity';

@ApiBearerAuth()
@ApiTags('transaction')
@Controller('transaction')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ResponseMappingInterceptor)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiBody({ type: CreateTransactionDto })
  @ApiOkResponse({ type: IdResponseDto })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  @ApiResponse({ status: 201, type: getPaginationResponseDto(Transaction) })
  findAll(@Query() queryDto: TransactionQueryDto) {
    return this.transactionService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: Transaction })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transactionService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: CreateTransactionDto })
  @ApiOkResponse({ type: IdResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.transactionService.delete(id);
  }
}

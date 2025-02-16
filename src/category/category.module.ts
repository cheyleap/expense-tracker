import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepositoryImpl } from './repository/category.repository';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepositoryImpl],
  imports: [TypeOrmModule.forFeature([Category])],
  exports: [CategoryRepositoryImpl, CategoryService],
})
export class CategoryModule {}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { BudgetLimitModule } from './budget-limit/budget-limit.module';
import { RequestContextMiddleware } from './common/middlewares/request.middleware';
import { JwtService } from '@nestjs/jwt';

dotenv.config({
  path: `${process.cwd()}/src/.env`,
});

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: String(process.env.DB_DATABASE),
      username: String(process.env.DB_USERNAME),
      password: String(process.env.DB_PASSWORD),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      subscribers: [],
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    TransactionModule,
    CategoryModule,
    UserModule,
    AuthenticationModule,
    BudgetLimitModule,
  ],
  controllers: [],
  providers: [JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}

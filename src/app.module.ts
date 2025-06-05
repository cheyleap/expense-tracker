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
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import {
  DirectiveLocation,
  GraphQLDirective,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { upperDirectiveTransformer } from './common/graphql/directives/uppercase.directive';
import { isNotEmptyDirectiveTransformer } from './common/graphql/directives/is-not-empty.directive';
import { nonEmptyObjectDirectiveTransformer } from './common/graphql/directives/not-empty-object.directive';
import { isEnumDirectiveTransformer } from './common/graphql/directives/is-enum.directive';

dotenv.config({
  path: `${process.cwd()}/src/.env`,
});

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      sortSchema: true,
      graphiql: true,
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      transformSchema: (schema) => {
        schema = upperDirectiveTransformer(schema);
        schema = isNotEmptyDirectiveTransformer(schema);
        schema = nonEmptyObjectDirectiveTransformer(schema);
        schema = isEnumDirectiveTransformer(schema);
        return schema;
      },
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
          new GraphQLDirective({
            name: 'isNotEmpty',
            locations: [
              DirectiveLocation.FIELD_DEFINITION,
              DirectiveLocation.INPUT_FIELD_DEFINITION,
            ],
          }),
          new GraphQLDirective({
            name: 'nonEmptyObject',
            locations: [
              DirectiveLocation.OBJECT,
              DirectiveLocation.INPUT_OBJECT,
            ],
          }),
          new GraphQLDirective({
            name: 'isEnum',
            locations: [
              DirectiveLocation.FIELD_DEFINITION,
              DirectiveLocation.INPUT_FIELD_DEFINITION,
            ],
            args: {
              enumType: { type: new GraphQLNonNull(GraphQLString) },
            },
          }),
        ],
      },
    }),
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

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Field, InputType, Directive } from '@nestjs/graphql';
import { uppercaseMiddleware } from 'src/common/graphql/middleware/uppercase.middleware';

@InputType()
export class CreateUserDto {
  @Directive('@isNotEmpty')
  @Field({ middleware: [uppercaseMiddleware] })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  username: string;

  @Directive('@isNotEmpty')
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @Directive('@isNotEmpty')
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  password: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(11)
  @IsOptional()
  phone?: string;
}

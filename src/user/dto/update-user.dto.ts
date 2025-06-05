import { InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserDto {
  @Field()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  username: string;

  @Field()
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @Field()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  password: string;

  @Field({ nullable: true })
  @IsString()
  @MaxLength(11)
  @IsOptional()
  phone: string;
}

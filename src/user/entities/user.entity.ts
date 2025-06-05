import { Column, Entity } from 'typeorm';
import { AuditBaseEntity } from '../../common/entity/audit/audit-base.entity';
import { Exclude } from 'class-transformer';
import { Field, ObjectType } from '@nestjs/graphql';
import { uppercaseMiddleware } from '../../common/graphql/middleware/uppercase.middleware';

@Entity()
@ObjectType()
export class User extends AuditBaseEntity {
  @Field({ middleware: [uppercaseMiddleware] })
  @Column()
  username: string;

  @Field()
  @Column()
  email: string;

  @Field({ nullable: true })
  @Column()
  phone: string;

  @Exclude()
  @Column()
  password: string;
}

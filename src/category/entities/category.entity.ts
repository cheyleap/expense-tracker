import { Column, Entity } from 'typeorm';
import { AuditBaseEntity } from '../../common/entity/audit/audit-base.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Category extends AuditBaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;
}

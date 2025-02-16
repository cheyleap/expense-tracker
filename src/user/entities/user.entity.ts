import { Column, Entity } from 'typeorm';
import { AuditBaseEntity } from '../../common/entity/audit/audit-base.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends AuditBaseEntity {
  @Column() username: string;
  @Column() email: string;
  @Column() phone: string;
  @Exclude() @Column() password: string;
}

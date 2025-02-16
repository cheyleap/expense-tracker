import { Column, Entity } from 'typeorm';
import { AuditBaseEntity } from '../../common/entity/audit/audit-base.entity';

@Entity()
export class Category extends AuditBaseEntity {
  @Column() name: string;
  @Column() description: string;
}

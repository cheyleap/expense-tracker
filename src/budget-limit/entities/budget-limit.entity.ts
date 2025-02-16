import { AuditBaseEntity } from '../../common/entity/audit/audit-base.entity';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class BudgetLimit extends AuditBaseEntity {
  @Column({ type: 'decimal', precision: 2 })
  limitAmount: number;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, (category: Category) => category.id)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}

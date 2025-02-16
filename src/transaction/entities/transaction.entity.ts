import { AuditBaseEntity } from '../../common/entity/audit/audit-base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { TransactionType } from '../enums/transaction-type.enum';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Transaction extends AuditBaseEntity {
  @Column({ type: 'decimal', precision: 2 })
  amount: number;

  @Column()
  date: Date;

  @Column({ name: 'type' })
  transactionType: TransactionType;

  @Column()
  description: string;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, (category: Category) => category.id)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Produk } from './Produk';
import { OrderProduct } from './OrderProduct';
import { User } from './Users';

@Entity({ name: 'buyer_history' })
export class BuyerHistory {
  @PrimaryColumn()
  id: string;

  @Column()
  id_user: string;

  @Column()
  status: string;

  @Column()
  note: string;

  @Column()
  payment: string;

  @Column()
  payment_status: boolean;

  @Column({ default: '0' })
  price: string;

  @Column()
  purchase: number;

  @Column()
  order_date: Date;

  @ManyToMany(() => Produk, (product) => product.buyerHistory)
  @JoinTable()
  products: Produk[];

  @ManyToOne(() => User, (user) => user.buyerHistories)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.buyerHistory)
  public orderProduct: OrderProduct[];
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BuyerHistory } from './BuyerHistory';
import { Produk } from './Produk';

@Entity({ name: 'order_product' })
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  public quantity: number;

  @Column({ nullable: true })
  public status: string;

  @ManyToOne(() => BuyerHistory, (buyerHistory) => buyerHistory.orderProduct)
  @JoinColumn({ name: 'buyerHistoryId' })
  public buyerHistory: string;

  @ManyToOne(() => Produk, (product) => product.orderProduct)
  @JoinColumn({ name: 'productId' })
  public product: string;
}

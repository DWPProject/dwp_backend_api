import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'buyer_history' })
export class BuyerHistory {
  @PrimaryColumn()
  id: string;

  @Column()
  id_user: string;

  @Column()
  id_produk: string;

  @Column()
  quantity: number;

  @Column()
  status: string;

  @Column()
  payment: string;

  @Column()
  order_date: Date;
}

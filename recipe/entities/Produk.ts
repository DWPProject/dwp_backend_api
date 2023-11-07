import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';
import { BuyerHistory } from './BuyerHistory';
import { OrderProduct } from './OrderProduct';

@Entity({ name: 'produk' })
export class Produk {
  @PrimaryColumn()
  id: string;

  @Column()
  nama: string;

  @Column()
  harga: number;

  @Column()
  id_penjual: string;

  @Column()
  foto: string;

  @Column()
  stok: number;

  @Column()
  jual: boolean;

  @Column()
  kategori: string;

  @ManyToMany(() => BuyerHistory, (buyerHistory) => buyerHistory.products)
  buyerHistory: BuyerHistory[];

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  public orderProduct: OrderProduct[];
}

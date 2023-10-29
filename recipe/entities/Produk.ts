import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CartItem } from './CartItem';

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

  @OneToMany(() => CartItem, (item) => item.product_id)
  public CartItem: CartItem[];
}

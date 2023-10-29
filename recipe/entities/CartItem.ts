import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Produk } from './Produk';

@Entity({ name: 'cart_item' })
export class CartItem {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: false })
  product_id: string;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: false })
  quantity: number;

  @ManyToOne(() => Produk, (produk) => produk.id)
  public Produk: Produk;
}

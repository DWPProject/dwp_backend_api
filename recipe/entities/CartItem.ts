import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cart_item' })
export class CartItem {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  user_id: string;

  @Column()
  product_id: string;

  @Column()
  quantity: number;
}

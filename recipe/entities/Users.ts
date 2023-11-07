import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { BuyerHistory } from './BuyerHistory';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  nama_toko: string;

  @Column({ unique: true })
  telepon: string;

  @Column()
  profil: string;

  @Column({ nullable: true })
  type_seller: number;

  @Column()
  level: string;

  @OneToMany(() => BuyerHistory, (buyerHistory) => buyerHistory.user)
  @JoinColumn({ name: 'id' })
  buyerHistories: BuyerHistory[];
}

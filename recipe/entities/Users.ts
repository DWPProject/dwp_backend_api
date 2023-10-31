import { Column, Entity, PrimaryColumn } from 'typeorm';

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
  telepon: string;

  @Column()
  profil: string;

  @Column({ nullable: true })
  type_seller: number;

  @Column()
  level: string;
}

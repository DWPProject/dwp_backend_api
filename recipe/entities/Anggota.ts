import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'anggota' })
export class Anggota {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nama: string;

  @Column()
  foto: string;

  @Column()
  jabatan: string;
}

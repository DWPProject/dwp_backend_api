import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'berita' })
export class Berita {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  judul: string;

  @Column({ type: 'text', nullable: true })
  deskripsi: string;

  @Column()
  gambar: string;

  @Column()
  kategori: string;

  @Column()
  penulis: string;

  @Column()
  createdAt: Date;

  @Column()
  updateAt: Date;
}

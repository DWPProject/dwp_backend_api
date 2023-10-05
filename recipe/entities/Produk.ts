import { Column, Entity, PrimaryColumn } from 'typeorm';

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
}

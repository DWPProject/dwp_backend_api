export class CreateProductDto {
  nama: string;
  harga: number;
  id_penjual: string;
  foto: string;
  stok: number;
  jual: number;
  kategori: string;
}
export class UpdateProductDto {
  nama: string;
  harga: number;
  foto: string;
  stok: number;
  jual: number;
  kategori: string;
}

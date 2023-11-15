export class CreateProductDto {
  nama: string;
  harga: number;
  id_penjual: string;
  stok: number;
  kategori: string;
}
export class UpdateProductDto {
  nama: string;
  harga: number;
  stok: number;
  kategori: string;
}

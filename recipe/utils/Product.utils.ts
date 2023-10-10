export class CreateProductParams {
  nama: string;
  harga: number;
  id_penjual: string;
  foto: string;
  kategori: string;
}
export class UpdateProductParams {
  nama: string;
  harga: number;
  foto: string;
  kategori: string;
}

export class UpdateStokProductParams {
  stok: number;
}

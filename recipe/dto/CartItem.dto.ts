export class CreateCartItemDto {
  user_id: string;
  product_id: string;
  note: string;
  quantity: number;
}
export class UpdateCartItemDto {
  user_id: string;
  product_id: string;
  note: string;
  quantity: number;
}

export class GetDataItemDto {
  user_id: string;
}

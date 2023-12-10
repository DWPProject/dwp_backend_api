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
  purchase: number;
  address: string;
}
export class CreateOrderUserCart {
  userId: string;
  purchase: number;
  id: string;
  address: string;
}

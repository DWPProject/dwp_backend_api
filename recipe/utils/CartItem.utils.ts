import { IsString, IsUUID, IsNumber, IsNotEmpty } from 'class-validator';
export class CreateCartItemParams {
  user_id: string;
  product_id: string;
  note: string;
  quantity: number;
}
export class UpdateCartItemParams {
  user_id: string;
  product_id: string;
  note: string;
  quantity: number;
}

export class GetDataItemParams {
  user_id: string;
}

export class CreateOrderUserCartParams {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  purchase: number;

  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

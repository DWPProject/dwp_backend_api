export class CreateOrderProductParams {
  produkId: string;
  buyerHistoryId: string;
  quantity: number;
}

export class ChangeOrderStatusDto {
  id: string;
  status: string;
}
export class ChangeOrderStatusParams {
  status: string;
}

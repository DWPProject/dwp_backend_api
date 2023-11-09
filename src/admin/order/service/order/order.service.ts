import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from 'recipe/entities/OrderProduct';
import { CreateOrderProductParams } from 'recipe/utils/orderProduct';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderProduct)
    private orderProductRepo: Repository<OrderProduct>,
  ) {}

  async createOrderProduct(
    createOrderProductParams: CreateOrderProductParams,
    manager: EntityManager,
  ) {
    return manager.transaction(async (transactionManager) => {
      const data = new OrderProduct();
      data.buyerHistory = createOrderProductParams.buyerHistoryId;
      data.product = createOrderProductParams.produkId;
      data.quantity = createOrderProductParams.quantity;

      return await transactionManager.save(OrderProduct, data);
    });
  }

  async getPopulerProduk(id?: string) {
    const data = this.orderProductRepo
      .createQueryBuilder('order_product')
      .select([
        'product.id',
        'product.nama',
        'product.harga',
        'product.id_penjual',
        'product.foto',
        'product.stok',
        'product.jual',
        'SUM(order_product.quantity) AS terjual',
        'SUM(order_Product.quantity) * product.harga AS total',
      ])
      .innerJoin('order_product.product', 'product')
      .groupBy(
        'product.id, product.nama, product.harga, product.id_penjual, product.foto, product.stok, product.jual, product.kategori',
      )
      .orderBy('terjual', 'DESC')
      // .where('product.id_penjual = :id_penjual', { id_penjual: id })
      .getRawMany();

    return data;
  }
}

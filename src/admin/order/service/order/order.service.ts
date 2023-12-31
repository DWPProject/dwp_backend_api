import { HttpStatus, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from 'recipe/entities/OrderProduct';
import { CreateOrderProductParams } from 'recipe/utils/orderProduct';
import { EntityManager, Repository, Transaction } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderProduct)
    private orderProductRepo: Repository<OrderProduct>,
    private entityManager: EntityManager,
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

  async finishOrderProduct(buyerHistoryId: string, sellerid: string) {
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        try {
          const result = await transactionalEntityManager
            .createQueryBuilder()
            .update('order_product') // Gunakan nama tabel dari database
            .set({ status: 'Pesanan Selesai' })
            .where('"buyerHistoryId" = :buyerHistoryId', { buyerHistoryId })
            .andWhere(
              '"productId" IN (SELECT "id" FROM produk WHERE id_penjual = :sellerid)',
              { sellerid },
            )
            .execute();

          if (result.affected === 0) {
            return false;
          }
          return true;
        } catch (error) {
          console.error('Error finishing order product:', error);
          throw new Error('Failed to finish order product');
        }
      },
    );
  }

  async checkOrderProduct(buyerHistoryId: string) {
    const result = await this.orderProductRepo
      .createQueryBuilder('orderProduct')
      .where('orderProduct.buyerHistory = :buyerHistoryId', { buyerHistoryId })
      .andWhere('orderProduct.status IS NULL')
      .getMany();

    return result.length === 0;
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

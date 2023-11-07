import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { User } from 'recipe/entities/Users';
import { CreateBuyerHistoryParams } from 'recipe/utils/buyerHistory.utils';
import { EntityManager, ManyToMany, Repository } from 'typeorm';

@Injectable()
export class BuyerHistoryService {
  constructor(
    @InjectRepository(BuyerHistory)
    private buyerHistoryRepo: Repository<BuyerHistory>,
  ) {}

  async createHistoryUser(
    createBuyerHistoryParams: CreateBuyerHistoryParams,
    manager: EntityManager,
    id: string,
  ) {
    return manager.transaction(async (transactionManager) => {
      const now = new Date();

      const newHistory = this.buyerHistoryRepo.create({
        id: id,
        ...createBuyerHistoryParams,
        status: 'Belum diProses',
        order_date: now,
        payment_status: false,
      });
      await transactionManager.save(BuyerHistory, newHistory);
    });
  }

  async getDataOrderAdmin() {
    const query = await this.buyerHistoryRepo
      .createQueryBuilder('buyer_history')
      .select([
        'buyer_history.id',
        'users.username',
        'users.telepon',
        'users.profil',
        'buyer_history.id_user',
        'buyer_history.order_date',
        'buyer_history.payment_status',
        'buyer_history.status',
        'buyer_history.payment',
        'buyer_history.price',
        'buyer_history.address',
        'produk.foto',
        'produk.nama',
        'produk.id_penjual',
        'order_product.quantity',
        'produk.harga',
        '(produk.harga * order_product.quantity) AS total_harga',
      ])
      .leftJoin('buyer_history.orderProduct', 'order_product')
      .leftJoin('order_product.product', 'produk')
      .leftJoin('buyer_history.user', 'users')
      .orderBy('buyer_history.order_date', 'DESC')
      .getMany();

    const newData = query.map((item) => ({
      ...item,
      order_date: item.order_date.toLocaleString(),
    }));

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Data Order Admin',
      data: newData,
    };
  }
}

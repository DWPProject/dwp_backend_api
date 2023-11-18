import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { CreateBuyerHistoryParams } from 'recipe/utils/buyerHistory.utils';
import { EntityManager, Repository } from 'typeorm';
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

  async reportOrderOverview(id?: string, start?: string, end?: string) {
    const query = this.buyerHistoryRepo
      .createQueryBuilder('buyer_history')
      .select([
        'buyer_history.id AS id_order',
        'buyer_history.order_date AS order_date',
        'produk.nama AS nama',
        'produk.foto AS foto',
        'order_product.quantity AS quantity',
        'produk.harga AS harga',
        '(produk.harga * order_product.quantity) AS total_harga',
        '(produk.harga * order_product.quantity) * (1 - CASE WHEN (SELECT type_seller FROM users WHERE id = produk.id_penjual) = 0 THEN 0.05 ELSE 0.10 END) AS seller_cash',
        '(produk.harga * order_product.quantity) * (CASE WHEN (SELECT type_seller FROM users WHERE id = produk.id_penjual) = 0 THEN 0.05 ELSE 0.10 END) AS dwp_cash',
      ])
      .addSelect((subQuery) => {
        subQuery
          .select('users.type_seller', 'type_seller')
          .from('users', 'users')
          .where('users.id = produk.id_penjual');
        return subQuery;
      }, 'type_seller')
      .leftJoin('buyer_history.orderProduct', 'order_product')
      .leftJoin('order_product.product', 'produk')
      .leftJoin('buyer_history.user', 'users')
      .orderBy('buyer_history.order_date', 'DESC')
      .where('buyer_history.payment_status = :payment_status', {
        payment_status: true,
      });
    if (id) {
      query.andWhere('produk.id_penjual = :id', { id });
    }
    if (start) {
      query.andWhere('buyer_history.order_date >= :startDate', {
        startDate: start,
      });
    }
    if (end) {
      query.andWhere('buyer_history.order_date <= :endDate', { endDate: end });
    }
    const result = await query.getRawMany();

    const newData = result.map((item) => ({
      ...item,
      order_date: item.order_date.toLocaleString(),
    }));

    const pendapatan = result.reduce(
      (acc, item) => acc + parseFloat(item.total_harga),
      0,
    );
    const cash_seller_total = result.reduce(
      (acc, item) => acc + parseFloat(item.seller_cash),
      0,
    );
    const cash_dwp_total = result.reduce(
      (acc, item) => acc + parseFloat(item.dwp_cash),
      0,
    );

    return {
      pendapatan,
      cash_dwp_total,
      cash_seller_total,
    };
  }
  async reportOrder(id?: string, start?: string, end?: string) {
    const query = this.buyerHistoryRepo
      .createQueryBuilder('buyer_history')
      .select([
        'buyer_history.id AS id_order',
        'buyer_history.order_date AS order_date',
        'produk.nama AS nama',
        'produk.foto AS foto',
        'users.nama_toko AS nama_toko',
        'order_product.quantity AS quantity',
        'produk.harga AS harga',
        '(produk.harga * order_product.quantity) AS total_harga',
        '(produk.harga * order_product.quantity) * (1 - CASE WHEN (SELECT type_seller FROM users WHERE id = produk.id_penjual) = 0 THEN 0.05 ELSE 0.10 END) AS seller_cash',
        '(produk.harga * order_product.quantity) * (CASE WHEN (SELECT type_seller FROM users WHERE id = produk.id_penjual) = 0 THEN 0.05 ELSE 0.10 END) AS dwp_cash',
      ])
      .addSelect((subQuery) => {
        subQuery
          .select('users.type_seller', 'type_seller')
          .from('users', 'users')
          .where('users.id = produk.id_penjual');
        return subQuery;
      }, 'type_seller')
      .leftJoin('buyer_history.orderProduct', 'order_product')
      .leftJoin('order_product.product', 'produk')
      .leftJoin('buyer_history.user', 'users')
      .orderBy('buyer_history.order_date', 'DESC')
      .where('buyer_history.payment_status = :payment_status', {
        payment_status: true,
      });
    if (id) {
      query.andWhere('produk.id_penjual = :id', { id });
    }
    if (start) {
      query.andWhere('buyer_history.order_date >= :startDate', {
        startDate: start,
      });
    }
    if (end) {
      query.andWhere('buyer_history.order_date <= :endDate', { endDate: end });
    }
    const result = await query.getRawMany();

    const newData = result.map((item) => ({
      ...item,
      order_date: item.order_date.toLocaleString(),
    }));

    const pendapatan = result.reduce(
      (acc, item) => acc + parseFloat(item.total_harga),
      0,
    );
    const cash_seller_total = result.reduce(
      (acc, item) => acc + parseFloat(item.seller_cash),
      0,
    );
    const cash_dwp_total = result.reduce(
      (acc, item) => acc + parseFloat(item.dwp_cash),
      0,
    );

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Data Order Admin',
      data: {
        pendapatan,
        cash_dwp_total,
        cash_seller_total,
        payload: newData,
      },
    };
  }

  async changeOrderStatus(id: string, status: string) {
    const result = await this.buyerHistoryRepo.update({ id }, { status });

    if (result.affected === 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Data Not Found',
      };
    }

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Change Order Data',
    };
  }

  async aproveOrder(id: string) {
    const result = await this.buyerHistoryRepo.update(
      { id },
      { payment_status: true, status: 'DiProses' },
    );

    if (result.affected === 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Data Not Found',
      };
    }

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Approve Order',
    };
  }

  async finishOrder(id: string) {
    const result = await this.buyerHistoryRepo.update(
      { id },
      { status: 'Pesanan Selesai' },
    );

    if (result.affected === 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Data Not Found',
      };
    }

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Finish Order',
    };
  }

  async declineOrder(id: string) {
    const result = await this.buyerHistoryRepo.update(
      { id },
      { status: 'Pesanan Ditolak' },
    );

    if (result.affected === 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Data Not Found',
      };
    }

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Decline Order',
    };
  }

  async getDataOrderSeller(id_user: string) {
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
      .where('buyer_history.payment_status = :payment_status', {
        payment_status: true,
      })
      .andWhere('produk.id_penjual = :id', {
        id: id_user,
      })
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

  async orderHistoryFinish(id: string) {
    const data = this.buyerHistoryRepo.find({
      where: {
        id: id,
        status: 'Pesanan Selesai',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Order History',
      data: data,
    };
  }

  async orderHistoryOnGoing(id: string) {
    const data = this.buyerHistoryRepo.find({
      where: {
        id: id,
        status: 'DiProses',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Order History',
      data: data,
    };
  }

  async orderHistoryDecline(id: string) {
    const data = this.buyerHistoryRepo.find({
      where: {
        id: id,
        status: 'Pesanan Ditolak',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Order History',
      data: data,
    };
  }
}

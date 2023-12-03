import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { OrderProduct } from 'recipe/entities/OrderProduct';
import { Produk } from 'recipe/entities/Produk';
import { CreateBuyerHistoryParams } from 'recipe/utils/buyerHistory.utils';
import { OrderService } from 'src/admin/order/service/order/order.service';
import { EmailService } from 'src/mailtrap/service/service.service';
import { EntityManager, Repository } from 'typeorm';
@Injectable()
export class BuyerHistoryService {
  constructor(
    @InjectRepository(BuyerHistory)
    private buyerHistoryRepo: Repository<BuyerHistory>,
    private orderService: OrderService,
    private emailService: EmailService,
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
      .addSelect((subQuery) => {
        subQuery
          .select('users.nama_toko', 'nama_toko')
          .from('users', 'users')
          .where('users.id = produk.id_penjual');
        return subQuery;
      }, 'nama_toko')
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
      query.andWhere('buyer_history.order_date <= :endDate', {
        endDate: `${end} 23:59:59.00`,
      });
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

  async getEmailSellerOrder(idOrder: string) {
    const temp = [];
    const query = await this.buyerHistoryRepo
      .createQueryBuilder('buyer_history')
      .select('users.email', 'email')
      .leftJoin('buyer_history.orderProduct', 'order_product')
      .leftJoin('order_product.product', 'product')
      .leftJoin('product.user', 'users') // Ganti 'user' dengan nama relasi yang sesuai dengan entitas Anda
      .where('buyer_history.id = :idOrder', { idOrder })
      .getRawMany();

    query.map((item) => {
      if (!temp.includes(item.email)) {
        temp.push(item.email);
      }
    });

    return temp;
  }

  async getDataOrderEmail(idOrder: string, email: string) {}

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

    const email = await this.getEmailSellerOrder(id);

    email.forEach(async (element) => {
      await this.emailService.sendEmail(element, 'Order', 'Order');
    });

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Approve Order',
    };
  }

  async finishOrder(sellerId: string, idOrder: string) {
    await this.orderService.finishOrderProduct(idOrder, sellerId);
    const checkRes = await this.orderService.checkOrderProduct(idOrder);
    if (checkRes) {
      const result = await this.buyerHistoryRepo.update(
        { id: idOrder },
        { status: 'Pesanan Selesai' },
      );

      if (result.affected === 0) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          status: 'Failed',
          message: 'Data Not Found',
        };
      }
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
        'buyer_history',
        'produk.id',
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
    const result = await this.buyerHistoryRepo
      .createQueryBuilder('buyer_history')
      .select([
        'produk.foto',
        'produk.nama',
        'order_product.quantity',
        'buyer_history.status',
        '(order_product.quantity * produk.harga) AS price',
      ])
      .leftJoin(
        OrderProduct,
        'order_product',
        'buyer_history.id = order_product.buyerHistoryId',
      )
      .leftJoin(Produk, 'produk', 'order_product.productId = produk.id')
      .where('buyer_history.id_user = :id', { id })
      .andWhere('buyer_history.status = :status', { status: 'Pesanan Selesai' })
      .getRawMany();

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Order History',
      data: result,
    };
  }

  async orderHistoryOnGoing(id: string) {
    const result = await this.buyerHistoryRepo
      .createQueryBuilder('buyer_history')
      .select([
        'produk.foto',
        'produk.nama',
        'order_product.quantity',
        'buyer_history.status',
        '(order_product.quantity * produk.harga) AS price',
      ])
      .leftJoin(
        OrderProduct,
        'order_product',
        'buyer_history.id = order_product.buyerHistoryId',
      )
      .leftJoin(Produk, 'produk', 'order_product.productId = produk.id')
      .where('buyer_history.id_user = :id', { id })
      .andWhere('buyer_history.status = :status', { status: 'DiProses' })
      .getRawMany();

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Order History',
      data: result,
    };
  }

  async orderHistoryDecline(id: string) {
    const result = await this.buyerHistoryRepo
      .createQueryBuilder('buyer_history')
      .select([
        'produk.foto',
        'produk.nama',
        'order_product.quantity',
        'buyer_history.status',
        '(order_product.quantity * produk.harga) AS price',
      ])
      .leftJoin(
        OrderProduct,
        'order_product',
        'buyer_history.id = order_product.buyerHistoryId',
      )
      .leftJoin(Produk, 'produk', 'order_product.productId = produk.id')
      .where('buyer_history.id_user = :id', { id })
      .andWhere('buyer_history.status = :status', { status: 'Pesanan Ditolak' })
      .getRawMany();

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Order History',
      data: result,
    };
  }
}

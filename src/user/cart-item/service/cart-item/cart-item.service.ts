import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'recipe/entities/CartItem';
import { Repository, EntityManager } from 'typeorm';
import { CreateCartItemParams } from 'recipe/utils/CartItem.utils';
import { ProductService } from 'src/admin/product/service/product/product.service';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';
import { CreateBuyerHistoryParams } from 'recipe/utils/buyerHistory.utils';
import { RandomStringGenerator } from 'recipe/utils/randomStringGenerator.utils';
import { CreateOrderProductParams } from 'recipe/utils/orderProduct';
import { OrderService } from 'src/admin/order/service/order/order.service';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productService: ProductService,
    private orderProductService: OrderService,
    private buyerHistoryService: BuyerHistoryService,
    private entityManager: EntityManager,
  ) {}

  async createItem(createCartItemParams: CreateCartItemParams) {
    const newItem = this.cartItemRepository.create({
      ...createCartItemParams,
    });

    await this.cartItemRepository.save(newItem);

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Create Data',
    };
  }

  async getDataCartItem(userId: string) {
    const totalQuery = await this.cartItemRepository
      .createQueryBuilder('cart_item')
      .select('SUM(produk.harga * cart_item.quantity)', 'totalPrice')
      .leftJoin('cart_item.product', 'produk')
      .where('cart_item.user_id = :userId', { userId: userId })
      .getRawOne();

    const listItem = await this.cartItemRepository
      .createQueryBuilder('cart_item')
      .select([
        'produk.nama',
        'cart_item.quantity',
        'cart_item.note',
        'produk.foto',
        '(produk.harga * cart_item.quantity) AS total',
      ])
      .leftJoin('cart_item.product', 'produk')
      .where('cart_item.user_id = :userId', { userId: userId })
      .getRawMany();

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Data Item',
      data: {
        price: totalQuery ? totalQuery.totalPrice : 0,
        payload: listItem,
      },
    };
  }

  async getDataCartItemService(userId: string) {
    const totalQuery = await this.cartItemRepository
      .createQueryBuilder('cart_item')
      .select('SUM(produk.harga * cart_item.quantity)', 'totalPrice')
      .leftJoin('cart_item.product', 'produk')
      .where('cart_item.user_id = :userId', { userId: userId })
      .getRawOne();

    const listItem = await this.cartItemRepository
      .createQueryBuilder('cart_item')
      .select([
        'cart_item.product_id AS product_id',
        'cart_item.user_id AS user_id',
        'cart_item.note AS note',
        'cart_item.quantity AS quantity',
        '(produk.harga * cart_item.quantity) AS total',
      ])
      .leftJoin('cart_item.product', 'produk')
      .where('cart_item.user_id = :userId', { userId: userId })
      .getRawMany();

    return {
      price: totalQuery ? totalQuery.totalPrice : 0,
      payload: listItem,
    };
  }

  async orderNow(userId: string, foto: string, purchase: number, id: string) {
    return this.entityManager.transaction(async (transactionEntityManager) => {
      const listItem = await this.getDataCartItemService(userId);

      // Membuat History Pemesanan
      const data = new CreateBuyerHistoryParams();
      data.id_user = userId;
      data.note = listItem.payload[0].note;
      data.purchase = purchase;
      data.payment = foto;
      data.price = listItem.price;

      await this.buyerHistoryService.createHistoryUser(
        data,
        transactionEntityManager,
        id,
      );
      for (const item of listItem.payload) {
        // Mengurangi Product
        await this.productService.orderProduct(
          item.product_id,
          item.quantity,
          transactionEntityManager,
        );

        // Masukin Relasi Produk ke Pesanan
        const orderProduct = new CreateOrderProductParams();
        orderProduct.buyerHistoryId = id;
        orderProduct.produkId = item.product_id;
        orderProduct.quantity = item.quantity;
        await this.orderProductService.createOrderProduct(
          orderProduct,
          transactionEntityManager,
        );
      }
      return {
        statusCode: HttpStatus.OK,
        status: 'Success',
        message: 'Success Order',
      };
    });
  }
}

import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'recipe/entities/CartItem';
import { Repository, EntityManager } from 'typeorm';
import {
  CreateCartItemParams,
  CreateOrderUserCartParams,
  DeleteCartParams,
} from 'recipe/utils/CartItem.utils';
import { ProductService } from 'src/admin/product/service/product/product.service';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';
import { CreateBuyerHistoryParams } from 'recipe/utils/buyerHistory.utils';
import { RandomStringGenerator } from 'recipe/utils/randomStringGenerator.utils';
import { CreateOrderProductParams } from 'recipe/utils/orderProduct';
import { OrderService } from 'src/admin/order/service/order/order.service';
import { UploadService } from 'src/cloudinary/service/service.service';
import { validate } from 'class-validator';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productService: ProductService,
    private orderProductService: OrderService,
    private buyerHistoryService: BuyerHistoryService,
    private entityManager: EntityManager,
    private uploadCloudinary: UploadService,
  ) {}

  async createItem(createCartItemParams: CreateCartItemParams) {
    const newItem = this.cartItemRepository.create({
      ...createCartItemParams,
    });

    await this.cartItemRepository.save(newItem);

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Add To Cart',
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
        'cart_item.id',
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

  async DeleteCartParams(id: string) {
    const result = await this.cartItemRepository.delete(id);
    if (result.affected === 0) {
      return false;
    }
    return true;
  }

  async orderNow(
    foto: Express.Multer.File,
    createOrderParams: CreateOrderUserCartParams,
  ) {
    return this.entityManager.transaction(async (transactionEntityManager) => {
      const user = new CreateOrderUserCartParams();
      user.id = createOrderParams.id;
      user.address = createOrderParams.address;
      user.purchase = createOrderParams.purchase;
      user.userId = createOrderParams.userId;

      const errors = await validate(user);
      if (errors.length > 0) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          status: 'Failed',
          message: 'Validation failed',
          errors: errors.map((error) => Object.values(error.constraints)),
        };
      }
      if (!foto) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          status: 'Failed',
          message: 'Please Upload Foto',
        };
      }
      const res = await this.uploadCloudinary.uploadImage(foto).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
      // Membuat History Pemesanan
      const listItem = await this.getDataCartItemService(
        createOrderParams.userId,
      );
      const data = new CreateBuyerHistoryParams();
      data.id_user = createOrderParams.userId;
      data.note = listItem.payload[0].note;
      data.purchase = createOrderParams.purchase;
      data.payment = res.url;
      data.price = listItem.price;
      data.address = createOrderParams.address;

      await this.buyerHistoryService.createHistoryUser(
        data,
        transactionEntityManager,
        createOrderParams.id,
      );

      // const insufficientStockErrors = [];
      for (const item of listItem.payload) {
        try {
          // Mengurangi Product
          await this.productService.orderProduct(
            item.product_id,
            item.quantity,
            transactionEntityManager,
          );
          // Masukin Relasi Produk ke Pesanan
          const orderProduct = new CreateOrderProductParams();
          orderProduct.buyerHistoryId = createOrderParams.id;
          orderProduct.produkId = item.product_id;
          orderProduct.quantity = item.quantity;
          await this.orderProductService.createOrderProduct(
            orderProduct,
            transactionEntityManager,
          );
        } catch (error) {
          if (error.message.includes('Stok produk tidak mencukupi.')) {
            throw new Error('Stok tidak mencukupi');
          } else {
            throw new Error('Produk Sedang tidak dijual');
          }
        }
      }

      await this.DeleteCartParams(user.id);
      return {
        statusCode: HttpStatus.OK,
        status: 'Success',
        message: 'Success Order',
      };
    });
  }

  async deleteItemCart(deleteCartParams: DeleteCartParams) {
    const result = await this.cartItemRepository.delete(deleteCartParams.id);

    if (result.affected === 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Id Cart Not Found',
      };
    }

    return {
      statusCode: HttpStatus.ACCEPTED,
      status: 'successs',
      message: 'Success Delete Cart Item',
    };
  }
}

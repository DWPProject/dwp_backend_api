import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'recipe/entities/CartItem';
import { Repository, EntityManager } from 'typeorm';
import { CreateCartItemParams } from 'recipe/utils/CartItem.utils';
import { ProductService } from 'src/admin/product/service/product/product.service';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';
import { CreateBuyerHistoryParams } from 'recipe/utils/buyerHistory.utils';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productService: ProductService,
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
    const listItem = await this.cartItemRepository.find({
      where: {
        user_id: userId,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Data Item',
      data: listItem,
    };
  }

  async orderNow(userId: string, foto: string, purchase: number) {
    return this.entityManager.transaction(async (transactionEntityManager) => {
      const listItem = await transactionEntityManager.find(CartItem, {
        where: {
          user_id: userId,
        },
      });

      for (const item of listItem) {
        await this.productService.orderProduct(
          item.product_id,
          item.quantity,
          transactionEntityManager,
        );
      }

      for (const item of listItem) {
        const data = new CreateBuyerHistoryParams();
        data.id_produk = item.product_id;
        data.id_user = item.user_id;
        data.note = item.note;
        data.quantity = item.quantity;
        data.payment = foto;
        data.purchase = purchase;

        await this.buyerHistoryService.createHistoryUser(
          data,
          transactionEntityManager,
        );

        return {
          statusCode: HttpStatus.OK,
          status: 'Success',
          message: 'Success Order',
        };
      }
    });
  }
}

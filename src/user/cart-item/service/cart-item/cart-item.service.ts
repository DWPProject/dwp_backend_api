import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'recipe/entities/CartItem';
import { Repository, EntityManager, Transaction } from 'typeorm';
import { CreateCartItemParams } from 'recipe/utils/CartItem.utils';
import { ProductService } from 'src/admin/product/service/product/product.service';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productService: ProductService,
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

  async orderNow(userId: string) {
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
    });
  }
}

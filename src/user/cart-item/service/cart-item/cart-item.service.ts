import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'recipe/entities/CartItem';
import { Repository } from 'typeorm';
import { CreateCartItemParams } from 'recipe/utils/CartItem.utils';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
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

  async getDataCartItem(id: string) {
    const listItem = await this.cartItemRepository.find({
      where: {
        user_id: id,
      },
    });
    // console.log(listItem);

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Data Item',
      data: listItem,
    };
  }

  // async deleteItem(id: number) {
  //   await this.cartItemRepository.delete({ id });
  // }

  // async updateItem() {}
}

import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CreateCartItemDto } from 'recipe/dto/CartItem.dto';
import { CartItemService } from 'src/cart-item/service/cart-item/cart-item.service';

@Controller('cartItem')
export class CartItemController {
  constructor(private cartItemService: CartItemService) {}

  @Post()
  async addItem(@Body() createCartItemDto: CreateCartItemDto) {
    try {
      return await this.cartItemService.createItem(createCartItemDto);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
}

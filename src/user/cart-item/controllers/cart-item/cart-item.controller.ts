import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { CreateCartItemDto } from 'recipe/dto/CartItem.dto';
import { CartItemService } from '../../service/cart-item/cart-item.service';
import { RolesMiddleware } from 'src/middleware/roles.middleware';

@Controller('cartItem')
export class CartItemController {
  constructor(private cartItemService: CartItemService) {}

  // TIDAK DI IMPLEMENTASIKAN
  @Post()
  @SetMetadata('roles', ['user'])
  @UseGuards(RolesMiddleware)
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

  // @Get()
  // async getDataCartItem(@Body() user_id: string) {
  //   try {
  //     return await this.cartItemService.getDataCartItem(user_id);
  //   } catch (error) {
  //     return {
  //       status: HttpStatus.INTERNAL_SERVER_ERROR,
  //       error: `${error}`,
  //     };
  //   }
  // }
}

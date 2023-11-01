import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCartItemDto, GetDataItemDto } from 'recipe/dto/CartItem.dto';
import { ProductService } from 'src/admin/product/service/product/product.service';
import { AuthGuard } from 'src/middleware/auth.middleware';
import { CartItemService } from 'src/user/cart-item/service/cart-item/cart-item.service';

@Controller('shop')
export class ShopController {
  constructor(
    private productService: ProductService,
    private cartService: CartItemService,
  ) {}

  @Get('/')
  async getProductShop() {
    try {
      return await this.productService.getDataSellProduct();
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Get('/cart')
  async getCartUser(@Body() getDataItemDto: GetDataItemDto) {
    try {
      return await this.cartService.getDataCartItem(getDataItemDto.user_id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Post('/')
  async addToCart(@Body() createCartItemDto: CreateCartItemDto) {
    try {
      return await this.cartService.createItem(createCartItemDto);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
}

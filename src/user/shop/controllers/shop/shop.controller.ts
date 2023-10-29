import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { CreateCartItemDto } from 'recipe/dto/CartItem.dto';
import { ProductService } from 'src/admin/product/service/product/product.service';
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

  @Get('/cart')
  async getCartUser(@Body() id_user: string) {
    try {
      return await this.cartService.getDataCartItem(id_user);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @Post('/')
  async addToCart(@Body() createCartItemDto: CreateCartItemDto) {
    try {
      console.log(createCartItemDto);
      return await this.cartService.createItem(createCartItemDto);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
}

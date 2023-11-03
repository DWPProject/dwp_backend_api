import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { CreateCartItemDto, GetDataItemDto } from 'recipe/dto/CartItem.dto';
import { ProductService } from 'src/admin/product/service/product/product.service';
import { RolesMiddleware } from 'src/middleware/roles.middleware';
import { CartItemService } from 'src/user/cart-item/service/cart-item/cart-item.service';
import { EntityManager } from 'typeorm';

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

  // @UseGuards(AuthGuard)
  // @SetMetadata('roles', ['user'])
  // @UseGuards(RolesMiddleware)
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

  // @UseGuards(AuthGuard)
  @SetMetadata('roles', ['user'])
  @UseGuards(RolesMiddleware)
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

  @Post('/cart')
  async orderShopUser(@Body() getDataItemDto: GetDataItemDto) {
    try {
      return await this.cartService.orderNow(getDataItemDto.user_id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}tets`,
      };
    }
  }
}

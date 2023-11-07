import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCartItemDto, GetDataItemDto } from 'recipe/dto/CartItem.dto';
import { RandomStringGenerator } from 'recipe/utils/randomStringGenerator.utils';
import { multerOptions } from 'recipe/utils/uploadFile';
import { ProductService } from 'src/admin/product/service/product/product.service';
import { RolesMiddleware } from 'src/middleware/roles.middleware';
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
  // @SetMetadata('roles', ['user'])
  // @UseGuards(RolesMiddleware)
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
  @UseInterceptors(FileInterceptor('foto', multerOptions))
  async orderShopUser(
    @Body() getDataItemDto: GetDataItemDto,
    @UploadedFile() foto: Express.Multer.File,
  ) {
    try {
      const id = RandomStringGenerator();
      return await this.cartService.orderNow(
        getDataItemDto.user_id,
        foto.path,
        getDataItemDto.purchase,
        id,
      );
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}tets`,
      };
    }
  }
}

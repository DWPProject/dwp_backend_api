import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Param,
  Put,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto, UpdateProductDto } from 'recipe/dto/Product.utils';
import { multerOptions } from 'recipe/utils/uploadFile';
import { ProductService } from '../../service/product/product.service';
import { AuthGuard } from 'src/middleware/auth.middleware';
import { RolesMiddleware } from 'src/middleware/roles.middleware';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  // @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesMiddleware)
  @Get('bankProduct')
  async getProductBankProduct() {
    try {
      return await this.productService.getDataBankProduct();
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  // @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesMiddleware)
  @Put('bankProduct/:id')
  async sellProduct(@Param('id') id: string) {
    try {
      return await this.productService.sellProduct(id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  // @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesMiddleware)
  @Get('sellProduct')
  async getSellProduct() {
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
  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesMiddleware)
  @Delete(':id')
  async deleteDataProduct(@Param('id') id: string) {
    try {
      return await this.productService.deleteProduct(id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  // @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesMiddleware)
  @Put(':id')
  @UseInterceptors(FileInterceptor('foto', multerOptions))
  async updateProduct(
    @UploadedFile() foto: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      if (!foto) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'File Not Null',
        };
      }
      updateProductDto.foto = foto.path;
      return await this.productService.updateProduct(updateProductDto, id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  // @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesMiddleware)
  @Post('/')
  @UseInterceptors(FileInterceptor('foto', multerOptions))
  async createProduct(
    @UploadedFile() foto: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    try {
      if (!foto) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'File Not Null',
        };
      }
      createProductDto.foto = foto.path;
      return await this.productService.createProduct(createProductDto);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
}

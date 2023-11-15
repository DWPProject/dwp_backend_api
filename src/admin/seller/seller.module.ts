import { Module } from '@nestjs/common';
import { SellerController } from './controllers/seller/seller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'recipe/entities/Users';
import { AuthService } from 'src/user/auth/service/auth/auth.service';
import { ProductService } from '../product/service/product/product.service';
import { Produk } from 'recipe/entities/Produk';
import { UploadService } from 'src/cloudinary/service/service.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Produk])],
  controllers: [SellerController],
  providers: [AuthService, ProductService, UploadService],
})
export class SellerModule {}

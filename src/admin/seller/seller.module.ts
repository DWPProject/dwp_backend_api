import { Module } from '@nestjs/common';
import { SellerController } from './controllers/seller/seller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'recipe/entities/Users';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SellerController],
})
export class SellerModule {}

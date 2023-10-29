import { Module } from '@nestjs/common';
import { CartItemController } from './controllers/cart-item/cart-item.controller';
import { CartItemService } from './service/cart-item/cart-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from 'recipe/entities/CartItem';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  controllers: [CartItemController],
  providers: [CartItemService],
})
export class CartItemModule {}

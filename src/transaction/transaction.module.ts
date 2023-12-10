import { Module } from '@nestjs/common';
import { TransactionService } from './service/transaction/transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produk } from 'recipe/entities/Produk';
import { CartItem } from 'recipe/entities/CartItem';

@Module({
  imports: [TypeOrmModule.forFeature([Produk, CartItem])],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}

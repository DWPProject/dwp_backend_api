import { Module } from '@nestjs/common';
import { SellerController } from './controllers/seller/seller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'recipe/entities/Users';
import { AuthService } from 'src/user/auth/service/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SellerController],
  providers: [AuthService],
})
export class SellerModule {}

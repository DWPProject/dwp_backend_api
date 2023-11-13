import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './service/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'recipe/entities/Users';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './service/jwtConstant';
import { ProductService } from 'src/admin/product/service/product/product.service';
import { Produk } from 'recipe/entities/Produk';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Produk]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ProductService],
  exports: [AuthService],
})
export class AuthModule {}

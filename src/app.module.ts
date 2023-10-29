import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anggota } from 'recipe/entities/Anggota';
import { Berita } from 'recipe/entities/Berita';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { CartItem } from 'recipe/entities/CartItem';
import { Produk } from 'recipe/entities/Produk';
import { User } from 'recipe/entities/Users';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { AnggotaModule } from './admin/anggota/anggota.module';
import { CartItemModule } from './user/cart-item/cart-item.module';
import { ProductModule } from './admin/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'admin',
            children: [
              {
                path: '/',
                module: AnggotaModule,
              },
              {
                path: '/',
                module: ProductModule,
              },
            ],
          },
          {
            path: 'user',
            children: [
              {
                path: '/',
                module: CartItemModule,
              },
            ],
          },
        ],
      },
    ]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Anggota, Berita, BuyerHistory, CartItem, Produk, User],
        synchronize: true,
      }),
    }),
    AnggotaModule,
    CartItemModule,
    ProductModule,
  ],
})
export class AppModule {}

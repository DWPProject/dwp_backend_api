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
import { ShopModule } from './user/shop/shop.module';
import { AuthModule } from './user/auth/auth.module';
import { SellerModule } from './admin/seller/seller.module';
import { KontenModule } from './admin/konten/konten.module';
import { TransactionModule } from './transaction/transaction.module';
import { BuyerHistoryModule } from './user/buyer-history/buyer-history.module';
import { OrderModule } from './admin/order/order.module';
import { OrderProduct } from 'recipe/entities/OrderProduct';
import { HistoryModule } from './user/history/history.module';
import { OrderSellerModule } from './penjual/order-seller/order-seller.module';
import { ReportModule } from './admin/report/report.module';
import { ReportSellerModule } from './penjual/report-seller/report-seller.module';
import { OverviewModule } from './admin/overview/overview.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MailtrapModule } from './mailtrap/mailtrap.module';
import { MailerModule } from '@nestjs-modules/mailer';
import * as path from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASS'),
          },
        },
        template: {
          dir: path.join(__dirname, '..', '..', 'recipe/template'),
          adapter: new HandlebarsAdapter(undefined, {
            inlineCssEnabled: true,
            inlineCssOptions: {
              url: ' ',
              preserveMediaQueries: true,
            },
          }),
          options: {
            strict: true,
          },
        },
      }),
    }),
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
              {
                path: '/',
                module: SellerModule,
              },
              {
                path: '/',
                module: KontenModule,
              },
              {
                path: '/',
                module: OrderModule,
              },
              {
                path: '/',
                module: ReportModule,
              },
              {
                path: '/',
                module: OverviewModule,
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
              {
                path: '/',
                module: ShopModule,
              },
              {
                path: '/',
                module: AuthModule,
              },
              {
                path: '/profile',
                children: [
                  {
                    path: '/',
                    module: HistoryModule,
                  },
                ],
              },
            ],
          },
          {
            path: 'seller',
            children: [
              {
                path: '/',
                module: OrderSellerModule,
              },
              {
                path: '/',
                module: ReportSellerModule,
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
        entities: [
          Anggota,
          Berita,
          BuyerHistory,
          CartItem,
          Produk,
          User,
          OrderProduct,
        ],
        synchronize: true,
      }),
    }),
    AnggotaModule,
    CartItemModule,
    ProductModule,
    ShopModule,
    AuthModule,
    SellerModule,
    KontenModule,
    TransactionModule,
    BuyerHistoryModule,
    OrderModule,
    HistoryModule,
    OrderSellerModule,
    ReportModule,
    ReportSellerModule,
    OverviewModule,
    WhatsappModule,
    CloudinaryModule,
    MailtrapModule,
  ],
})
export class AppModule {}

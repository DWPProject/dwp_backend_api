import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anggota } from 'recipe/entities/Anggota';
import { Berita } from 'recipe/entities/Berita';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { CartItem } from 'recipe/entities/CartItem';
import { Produk } from 'recipe/entities/Produk';
import { User } from 'recipe/entities/Users';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AnggotaModule } from './anggota/anggota.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

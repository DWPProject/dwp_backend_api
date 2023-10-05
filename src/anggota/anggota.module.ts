import { Module } from '@nestjs/common';
import { AnggotaController } from './controllers/anggota/anggota.controller';
import { AnggotaService } from './service/anggota/anggota.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anggota } from 'recipe/entities/Anggota';

@Module({
  imports: [TypeOrmModule.forFeature([Anggota])],
  controllers: [AnggotaController],
  providers: [AnggotaService],
})
export class AnggotaModule {}

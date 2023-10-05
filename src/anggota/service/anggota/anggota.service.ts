import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Anggota } from 'recipe/entities/Anggota';
import {
  CreateAnggotaParams,
  UpdateAnggotaParams,
} from 'recipe/utils/Anggota.utils';
import { Repository } from 'typeorm';

@Injectable()
export class AnggotaService {
  constructor(
    @InjectRepository(Anggota) private anggotaRepository: Repository<Anggota>,
  ) {}
  async getallDataAnggota() {
    return await this.anggotaRepository.find();
  }

  createAnggota(createAnggotaParams: CreateAnggotaParams) {
    const newAnggota = this.anggotaRepository.create({
      ...createAnggotaParams,
    });

    return this.anggotaRepository.save(newAnggota);
  }

  updateAnggota(updateAnggotaParams: UpdateAnggotaParams, id: number) {
    return this.anggotaRepository.update({ id }, { ...updateAnggotaParams });
  }

  deleteAnggota(id: number) {
    return this.anggotaRepository.delete({ id });
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
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
  async getAllDataAnggota() {
    const data = await this.anggotaRepository.find();
    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Data',
      data: data,
    };
  }

  async createAnggota(createAnggotaParams: CreateAnggotaParams) {
    const newAnggota = this.anggotaRepository.create({
      ...createAnggotaParams,
    });
    await this.anggotaRepository.save(newAnggota);

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Create Data',
    };
  }

  async updateAnggota(updateAnggotaParams: UpdateAnggotaParams, id: number) {
    const result = await this.anggotaRepository.update(
      { id },
      { ...updateAnggotaParams },
    );
    if (result.affected === 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Data Not Found',
      };
    }

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Update Data',
    };
  }

  async deleteAnggota(id: number) {
    const result = await this.anggotaRepository.delete({ id });
    if (result.affected === 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Data Not Found',
      };
    }

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Delete Data',
    };
  }
}

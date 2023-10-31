import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Berita } from 'recipe/entities/Berita';
import {
  CreateBeritaParams,
  UpdateBeritaParams,
} from 'recipe/utils/Berita.utils';
import { Repository } from 'typeorm';

@Injectable()
export class KontenService {
  constructor(
    @InjectRepository(Berita) private kontenRepository: Repository<Berita>,
  ) {}

  async createKonten(createBeritaParams: CreateBeritaParams) {
    const now = new Date();
    const newKonten = this.kontenRepository.create({
      ...createBeritaParams,
      createdAt: now,
      updateAt: now,
    });

    await this.kontenRepository.save(newKonten);

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Create Data Konten',
    };
  }
  async updateKonten(updateBeritaParams: UpdateBeritaParams, id: number) {
    const now = new Date();
    const data = await this.kontenRepository.update(
      { id },
      { ...updateBeritaParams, updateAt: now },
    );

    if (data.affected === 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Data Not Found',
      };
    }

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Update Data Konten',
    };
  }
  async getAllDataKonten() {
    const data = await this.kontenRepository.find({
      order: {
        updateAt: 'DESC',
      },
    });
    const newData = data.map((item) => ({
      ...item,
      createdAt: item.createdAt.toLocaleString(),
      updateAt: item.updateAt.toLocaleString(),
    }));
    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Data Konten',
      data: newData,
    };
  }
  async getDataKontenById(id: number) {
    const data = await this.kontenRepository.findOne({
      where: {
        id: id,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Sell Product',
      data: data,
    };
  }
  async deleteKonten(id: number) {
    const result = await this.kontenRepository.delete({ id });
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

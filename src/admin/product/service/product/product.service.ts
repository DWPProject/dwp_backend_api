import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produk } from 'recipe/entities/Produk';
import {
  CreateProductParams,
  UpdateProductParams,
} from 'recipe/utils/Product.utils';
import { RandomStringGenerator } from 'recipe/utils/randomStringGenerator.utils';
import { EntityManager, Repository, getManager } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Produk) private produkRepository: Repository<Produk>,
  ) {}

  async createProduct(createProductParams: CreateProductParams) {
    const idProduct = RandomStringGenerator();
    const newProduct = this.produkRepository.create({
      id: idProduct,
      jual: false,
      ...createProductParams,
    });

    await this.produkRepository.save(newProduct);

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Create Data',
    };
  }

  async updateProduct(updateProductParams: UpdateProductParams, id: string) {
    const result = await this.produkRepository.update(
      { id },
      { ...updateProductParams },
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

  async sellProduct(id: string) {
    const result = await this.produkRepository.update({ id }, { jual: true });
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
      message: 'Success Sell Product',
    };
  }

  async getDataSellProduct() {
    const data = await this.produkRepository
      .createQueryBuilder('produk')
      .select([
        'users.id AS id_penjual',
        'users.nama_toko',
        'users.profil AS profile_penjual',
        'users.username',
        'produk.id AS id_produk',
        'produk.nama',
        'produk.foto AS gambar_produk',
        'produk.stok',
        'produk.id_penjual',
        'produk.kategori',
      ])
      .leftJoin('produk.user', 'users')
      .where('produk.jual = :jual', { jual: true })
      .getMany();

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Sell Product',
      data: data,
    };
  }
  async getDataBankProduct() {
    const data = await this.produkRepository
      .createQueryBuilder('produk')
      .select([
        'users.id AS id_penjual',
        'users.nama_toko',
        'users.profil AS profile_penjual',
        'users.username',
        'produk.id AS id_produk',
        'produk.nama',
        'produk.foto AS gambar_produk',
        'produk.stok',
        'produk.id_penjual',
        'produk.kategori',
      ])
      .leftJoin('produk.user', 'users')
      .where('produk.jual = :jual', { jual: false })
      .getMany();

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Bank Product',
      data: data,
    };
  }

  async orderProduct(id: string, stok: number, manager: EntityManager) {
    return manager.transaction(async (transactionalManager) => {
      const result = await transactionalManager.findOne(Produk, {
        where: {
          id: id,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!result) {
        throw new Error(`Produk dengan ID ${id} tidak ditemukan.`);
      }

      if (result.stok < stok) {
        throw new Error(`Stok produk tidak mencukupi.`);
      }

      result.stok -= stok;

      await transactionalManager.save(Produk, result);
    });
  }

  async deleteProduct(id: string) {
    const result = await this.produkRepository.delete({ id });
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

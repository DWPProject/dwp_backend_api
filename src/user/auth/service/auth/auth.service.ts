import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'recipe/entities/Users';
import {
  CreateUserParams,
  CreateUserSellerParams,
  DeleteSellerParams,
  LoginUserParams,
  LogoutUserParams,
  UpdateUserParams,
  UpdateUserSellerParams,
  forgotPasswordParams,
} from 'recipe/utils/User.utils';
import { ComparePassword, HashPassword } from 'recipe/utils/hashPassword';
import { RandomStringGenerator } from 'recipe/utils/randomStringGenerator.utils';
import { ProductService } from 'src/admin/product/service/product/product.service';
import { UploadService } from 'src/cloudinary/service/service.service';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private productSvc: ProductService,
    private jwtService: JwtService,
    private uploadCloudinary: UploadService,
  ) {}

  async createUser(createUserParams: CreateUserParams) {
    const user = new CreateUserParams();
    user.email = createUserParams.email;
    user.password = createUserParams.password;
    user.repassword = createUserParams.repassword;
    user.username = createUserParams.username;
    user.telepon = createUserParams.telepon;

    // Validate user input
    const errors = await validate(user);
    if (errors.length > 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Validation failed',
        errors: errors.map((error) => Object.values(error.constraints)).flat(),
      };
    }
    if (createUserParams.password != createUserParams.repassword) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Password and Repassword not match',
      };
    }

    const idUser = RandomStringGenerator();
    const hashPass = await HashPassword(createUserParams.password);

    const newUser = this.userRepository.create({
      id: idUser,
      email: createUserParams.email,
      password: hashPass,
      username: createUserParams.username,
      telepon: createUserParams.telepon,
      profil:
        'https://res.cloudinary.com/dic2dqube/image/upload/v1700027020/images/hzyztbdujr0cr7rivvzl.png',
      nama_toko: null,
      type_seller: null,
      level: 'user',
    });

    await this.userRepository.save(newUser);

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Register',
    };
  }
  async createUserPenjual(
    foto: Express.Multer.File,
    createUserSellerParams: CreateUserSellerParams,
  ) {
    if (!foto) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Please Upload Foto',
      };
    }
    if (createUserSellerParams.password != createUserSellerParams.repassword) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Password and Repassword not match',
      };
    }

    const idUser = RandomStringGenerator();
    const hashPass = await HashPassword(createUserSellerParams.password);
    const res = await this.uploadCloudinary.uploadImage(foto).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });

    const newUser = this.userRepository.create({
      id: idUser,
      email: createUserSellerParams.email,
      password: hashPass,
      username: createUserSellerParams.username,
      nama_toko: createUserSellerParams.nama_toko,
      profil: res.url,
      telepon: createUserSellerParams.telepon,
      type_seller: createUserSellerParams.type_seller,
      level: 'penjual',
    });

    await this.userRepository.save(newUser);

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Register',
    };
  }

  async updateUserPenjual(
    foto: Express.Multer.File,
    updateSellerParams: UpdateUserSellerParams,
  ) {
    if (!foto) {
      const success = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({
          username: updateSellerParams.username,
          nama_toko: updateSellerParams.nama_toko,
          type_seller: updateSellerParams.type_seller,
          telepon: updateSellerParams.telepon,
        })
        .where('email = :email', { email: updateSellerParams.email })
        .execute();
      if (success.affected === 0) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          status: 'failed',
          message: 'Failed Update User',
        };
      }
      return {
        statusCode: HttpStatus.ACCEPTED,
        status: 'successs',
        message: 'Success update Data User',
      };
    } else {
      const res = await this.uploadCloudinary.uploadImage(foto).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
      const success = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({
          username: updateSellerParams.username,
          nama_toko: updateSellerParams.nama_toko,
          type_seller: updateSellerParams.type_seller,
          telepon: updateSellerParams.telepon,
          profil: res.url,
        })
        .where('email = :email', { email: updateSellerParams.email })
        .execute();

      if (success.affected === 0) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          status: 'failed',
          message: 'Failed Update User',
        };
      }
      return {
        statusCode: HttpStatus.ACCEPTED,
        status: 'successs',
        message: 'Success update Data User',
      };
    }
  }

  async getDataSeller() {
    const userSeller = await this.userRepository.find({
      where: {
        level: 'penjual',
      },
    });
    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Data Seller',
      payload: userSeller,
    };
  }

  async loginUser(loginUserParams: LoginUserParams) {
    const data = await this.userRepository.findOne({
      where: {
        email: loginUserParams.email,
      },
    });
    if (!data) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Email or Password wrong',
      };
    }

    if (!(await ComparePassword(loginUserParams.password, data.password))) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Email or Password wrong',
      };
    }

    const payload = {
      id: data.id,
      email: data.email,
      level: data.level,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async forgotPassword(forgotPasswordParams: forgotPasswordParams) {
    const data = await this.userRepository.findOne({
      where: {
        email: forgotPasswordParams.email,
      },
    });
    console.log(data);

    if (!data) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Email not registered',
      };
    }

    if (
      forgotPasswordParams.newPassword !== forgotPasswordParams.reNewPassword
    ) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'failed',
        message: 'Password and Repassword do not match',
      };
    }

    const hashPass = await HashPassword(forgotPasswordParams.newPassword);

    const result = await this.userRepository.update(
      { email: data.email },
      { password: hashPass },
    );

    if (result.affected === 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'failed',
        message: 'Email not Registered',
      };
    }

    return {
      statusCode: HttpStatus.ACCEPTED,
      status: 'successs',
      message: 'Success CHange Password',
    };
  }
  async DeleteAccSeller(deleteSellerParams: DeleteSellerParams) {
    const result = await this.productSvc.findProductById(deleteSellerParams);
    if (result) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'failed',
        message: 'This User Have Product in Bank Product',
      };
    }
    const data = await this.userRepository.delete(deleteSellerParams.id);

    if (data.affected === 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'failed',
        message: 'Failed Delete Seller',
      };
    }

    return {
      statusCode: HttpStatus.ACCEPTED,
      status: 'successs',
      message: 'Success Delete Account Seller',
    };
  }

  async updateUser(
    foto: Express.Multer.File,
    updateUserParams: UpdateUserParams,
  ) {
    if (!foto) {
      const success = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({
          username: updateUserParams.username,
          telepon: updateUserParams.telepon,
        })
        .where('email = :email', { email: updateUserParams.email })
        .execute();
      if (success.affected === 0) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          status: 'failed',
          message: 'Failed Update User',
        };
      }

      return {
        statusCode: HttpStatus.ACCEPTED,
        status: 'successs',
        message: 'Success update Data User',
      };
    } else {
      const res = await this.uploadCloudinary.uploadImage(foto).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
      const success = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({
          username: updateUserParams.username,
          telepon: updateUserParams.telepon,
          profil: res.url,
        })
        .where('email = :email', { email: updateUserParams.email })
        .execute();

      if (success.affected === 0) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          status: 'failed',
          message: 'Failed Update User',
        };
      }

      return {
        statusCode: HttpStatus.ACCEPTED,
        status: 'successs',
        message: 'Success update Data User',
      };
    }
  }

  async LogoutUser(logoutUserParams: LogoutUserParams) {}
}

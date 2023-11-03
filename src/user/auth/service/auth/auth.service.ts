import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'recipe/entities/Users';
import {
  CreateUserParams,
  CreateUserSellerParams,
  LoginUserParams,
  forgotPasswordParams,
} from 'recipe/utils/User.utils';
import { ComparePassword, HashPassword } from 'recipe/utils/hashPassword';
import { RandomStringGenerator } from 'recipe/utils/randomStringGenerator.utils';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserParams: CreateUserParams) {
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
      profil: createUserParams.foto,
      telepon: createUserParams.telepon,
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
  async createUserPenjual(createUserSellerParams: CreateUserSellerParams) {
    if (createUserSellerParams.password != createUserSellerParams.repassword) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Password and Repassword not match',
      };
    }

    const idUser = RandomStringGenerator();
    const hashPass = await HashPassword(createUserSellerParams.password);

    const newUser = this.userRepository.create({
      id: idUser,
      email: createUserSellerParams.email,
      password: hashPass,
      username: createUserSellerParams.username,
      profil: createUserSellerParams.foto,
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

  async forgotPassword(forgotPasswordParams: forgotPasswordParams){
    const data = await this.userRepository.findOne({
      where: {
        email: forgotPasswordParams.email
      }
    })
    console.log(data)

    if(!data){
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Email not registered',
      };
    }

    if(forgotPasswordParams.newPassword !== forgotPasswordParams.reNewPassword){
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'failed',
        message: 'Password and Repassword do not match'
      }
    }

    const hashPass = await HashPassword(forgotPasswordParams.newPassword);

    const result = await this.userRepository.update(
      {email : data.email}, {password: hashPass}
    )

    if (result.affected === 0 ) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'failed',
        message: 'Email not Registered'
      }
    }

    return {
      statusCode: HttpStatus.ACCEPTED,
      status: 'successs',
      message: 'Success CHange Password'
    }
  }
}

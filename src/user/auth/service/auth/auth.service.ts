import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'recipe/entities/Users';
import { CreateUserParams } from 'recipe/utils/User.utils';
import { HashPassword } from 'recipe/utils/hashPassword';
import { RandomStringGenerator } from 'recipe/utils/randomStringGenerator.utils';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
      level: 'user',
    });

    await this.userRepository.save(newUser);

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Register',
    };
  }
  async createUserPenjual(createUserParams: CreateUserParams) {
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
      level: 'user',
    });

    await this.userRepository.save(newUser);

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Register',
    };
  }
}

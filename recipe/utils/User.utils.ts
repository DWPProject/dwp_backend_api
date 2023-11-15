import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserParams {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  repassword: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  telepon: string;
}

export class CreateUserSellerParams {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  repassword: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  nama_toko: string;

  @IsString()
  @IsNotEmpty()
  telepon: string;

  @IsNotEmpty()
  type_seller: number;
}
export class UpdateUserSellerParams {
  email: string;
  username: string;
  nama_toko: string;
  telepon: string;
  type_seller: number;
}

export class LoginUserParams {
  email: string;
  password: string;
}

export class UpdateUserParams {
  email: string;
  username: string;
  telepon: string;
}

export class forgotPasswordParams {
  email: string;
  newPassword: string;
  reNewPassword: string;
}

export class DeleteSellerParams {
  id: string;
}

export class LogoutUserParams {
  id: string;
}

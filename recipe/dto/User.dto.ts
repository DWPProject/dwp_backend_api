export class CreateUserDto {
  email: string;
  password: string;
  repassword: string;
  username: string;
  telepon: string;
  foto: string;
}
export class CreateUserSellerDto {
  email: string;
  password: string;
  repassword: string;
  username: string;
  telepon: string;
  type_seller: number;
  foto: string;
}

export class LoginUserDto {
  email: string;
  password: string;
}

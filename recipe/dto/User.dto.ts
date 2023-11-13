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
  nama_toko: string;
  telepon: string;
  type_seller: number;
  foto: string;
}

export class LoginUserDto {
  email: string;
  password: string;
}

export class forgotPasswordDto {
  email: string;
  newPassword: string;
  reNewPassword: string;
}

export class DeleteAccSeller {
  id: string;
}
export class LogoutUserDto {
  id: string;
}

export class CreateUserParams {
  email: string;
  password: string;
  repassword: string;
  username: string;
  telepon: string;
}

export class CreateUserSellerParams {
  email: string;
  password: string;
  repassword: string;
  username: string;
  nama_toko: string;
  telepon: string;
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

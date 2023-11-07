export class CreateUserParams {
  email: string;
  password: string;
  repassword: string;
  username: string;
  telepon: string;
  foto: string;
}

export class CreateUserSellerParams {
  email: string;
  password: string;
  repassword: string;
  username: string;
  nama_toko: string;
  telepon: string;
  type_seller: number;
  foto: string;
}

export class LoginUserParams {
  email: string;
  password: string;
}

export class UpdateUserParams {
  username: string;
  telepon: string;
  profil: string;
}

export class forgotPasswordParams {
  email: string;
  newPassword: string;
  reNewPassword: string;
}

export class User {
  pseudo: string;
  password: string;
  constructor(pseudo: string, password: string) {
    this.pseudo = pseudo;
    this.password = password;
  }
}

export class TokenData {
  token: any;
  expiresIn: number;
  id: string;
}

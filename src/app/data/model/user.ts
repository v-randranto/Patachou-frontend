import { Member } from './member';

export class LoginData {
  pseudo: string;
  password: string;
  constructor(pseudo: string, password: string) {
    this.pseudo = pseudo;
    this.password = password;
  }
}

export class User {
  member: Member;
  token: any;
}

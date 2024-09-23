export class User {
  id?: number;
  name: string;
  username: string;
  password: string;

  constructor(name: string, username: string, password: string) {
    this.username = username;
    this.password = password;
    this.name = name;
  }
}
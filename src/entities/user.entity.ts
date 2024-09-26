export class User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role_id?: number;

  constructor(name: string, email: string, password: string, role_id?: number) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.role_id = role_id;
  }
}
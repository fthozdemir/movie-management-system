import { IUser } from "@/interfaces";

export class User implements IUser {
  id: IUser["id"];
  username: IUser["username"];
  password: IUser["password"];
  age: IUser["age"];
  role: IUser["role"];
  tickets: IUser["tickets"];

  constructor(user: Omit<IUser, "id" | "tickets">) {
    this.username = user.username;
    this.password = user.password;
    this.age = user.age;
    this.role = user.role;
    this.tickets = [];
  }
}

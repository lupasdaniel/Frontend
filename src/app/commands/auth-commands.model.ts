import { UserDto } from "../models/user.model";

export class LoginCommand {
  email!: string;
  password!: string;
}


export class RegisterCommand{
  user!: UserDto;
}
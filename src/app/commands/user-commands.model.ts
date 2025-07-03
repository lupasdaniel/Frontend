import { UserDto } from "../models/user.model";

export interface AddUserCommand {
  user: UserDto;
}

export interface UpdateUserCommand {
  user: UserDto;
}

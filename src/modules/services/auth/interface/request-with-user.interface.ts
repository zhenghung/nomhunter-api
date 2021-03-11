import { Request } from "express";
import { UserEntity } from "../../../entities/user/user.entity";

export interface RequestWithUser extends Request {
  user: UserEntity;
}

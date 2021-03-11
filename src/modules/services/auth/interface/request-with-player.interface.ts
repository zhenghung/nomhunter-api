import { Request } from "express";
import { PlayerEntity } from "../../../entities/player/player.entity";

export interface RequestWithPlayer extends Request {
  user: PlayerEntity;
}

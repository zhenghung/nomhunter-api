import { BadgeEntity } from "../../badges/badge.entity";
import { UserEntity } from "../../users/user.entity";
import { GameEntity } from "../../games/game.entity";

export class CreateUserBadgeDto {
  badge: BadgeEntity;

  user: UserEntity;

  game: GameEntity;
}

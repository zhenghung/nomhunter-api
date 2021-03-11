import { BadgeEntity } from "../../badge/badge.entity";
import { UserEntity } from "../../user/user.entity";
import { GameEntity } from "../../game/game.entity";

export class CreateUserBadgeDto {
  badge: BadgeEntity;

  user: UserEntity;

  game: GameEntity;
}

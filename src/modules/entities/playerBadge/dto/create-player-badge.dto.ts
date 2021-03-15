import { BadgeEntity } from "../../badge/badge.entity";
import { PlayerEntity } from "../../player/player.entity";
import { GameEntity } from "../../game/game.entity";

export class CreatePlayerBadgeDto {
  badge: BadgeEntity;

  player: PlayerEntity;

  game: GameEntity;
}

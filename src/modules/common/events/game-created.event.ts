import { GameEntity } from "../../entities/game/game.entity";

export class GameCreatedEvent {
  public static readonly EVENT: string = "game.created";

  game: GameEntity;
}

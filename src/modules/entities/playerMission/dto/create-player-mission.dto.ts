import { MissionEntity } from "../../mission/mission.entity";
import { PlayerEntity } from "../../player/player.entity";

export class CreatePlayerMissionDto {
  mission: MissionEntity;
  player: PlayerEntity;
}

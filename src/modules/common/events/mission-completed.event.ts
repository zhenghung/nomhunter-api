import { PlayerMissionEntity } from "../../entities/playerMission/player-mission.entity";
import { MissionEntity } from "../../entities/mission/mission.entity";

export class MissionCompletedEvent {
  mission: MissionEntity;
  playerMission: PlayerMissionEntity;
}

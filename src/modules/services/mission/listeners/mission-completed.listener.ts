import { PlayerMissionEntityService } from "../../../entities/playerMission/player-mission.entity.service";
import { OnEvent } from "@nestjs/event-emitter";
import { Injectable, Logger } from "@nestjs/common";
import { MissionCompletedEvent } from "../../../common/events/mission-completed.event";

@Injectable()
export class MissionCompletedListener {
  private readonly logger = new Logger(MissionCompletedListener.name);
  constructor(private readonly playerMissionEntityService: PlayerMissionEntityService) {}

  @OnEvent("mission.completed", { async: true })
  async handleMissionCompletedEvent(event: MissionCompletedEvent) {
    // handle and process "MissionCompletedEvent" event
    const playerMission = event.playerMission;
    const mission = event.mission;
    // Set to complete if complete
    if (playerMission.currentProgress == mission.maxProgress) {
      this.logger.log(`Player: ${playerMission.player.id} completed mission: ${mission.id}`);
      return this.playerMissionEntityService.updateByEntityId(playerMission.id, {
        completed: true,
      });
    }
  }
}

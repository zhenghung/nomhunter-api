import { PlayerMissionEntityService } from "../../../entities/playerMission/player-mission.entity.service";
import { OnEvent } from "@nestjs/event-emitter";
import { Injectable, Logger } from "@nestjs/common";
import { MissionProgressEvent } from "../../../common/events/mission-progress.event";

@Injectable()
export class MissionProgressListener {
  private readonly logger = new Logger(MissionProgressListener.name);
  constructor(
    private readonly playerMissionEntityService: PlayerMissionEntityService
  ) {}

  @OnEvent("mission.progress", { async: true })
  async handleMissionProgressEvent(event: MissionProgressEvent) {
    // handle and process "MissionProgressEvent" event
    const playerMission = event.playerMission;
    const mission = event.mission;
    // Set to complete if complete
    if (playerMission.currentProgress == mission.maxProgress) {
      this.logger.log(
        `Player: ${playerMission.player.id} completed mission: ${mission.id}`
      );
      return this.playerMissionEntityService.updateByEntityId(
        playerMission.id,
        {
          completed: true,
        }
      );
    }
  }
}

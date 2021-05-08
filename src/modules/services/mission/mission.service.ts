import { Injectable, Logger } from "@nestjs/common";
import { PlayerMissionEntityService } from "../../entities/playerMission/player-mission.entity.service";
import { MissionEntityService } from "../../entities/mission/mission.entity.service";
import { CreatePlayerMissionDto } from "../../entities/playerMission/dto/create-player-mission.dto";
import { PlayerEntityService } from "../../entities/player/player.entity.service";
import { PlayerMissionEntity } from "../../entities/playerMission/player-mission.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { MissionEntity } from "../../entities/mission/mission.entity";
import { PlayerEntity } from "../../entities/player/player.entity";

@Injectable()
export class MissionService {
  private logger: Logger = new Logger(MissionService.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly playerEntityService: PlayerEntityService,
    private readonly missionEntityService: MissionEntityService,
    private readonly playerMissionEntityService: PlayerMissionEntityService
  ) {}

  async findPlayerMission(playerId: string): Promise<PlayerMissionEntity[]> {
    const player = await this.playerEntityService.getById(playerId);
    return this.playerMissionEntityService.findByPlayer(player);
  }

  async checkIfMissionRequirementFulfilled(
    player: PlayerEntity,
    mission: MissionEntity
  ): Promise<boolean> {
    // If mission has a requirement
    if (mission.requiredMission) {
      // Check if player completed requirement
      const requiredPlayerMission = await this.playerMissionEntityService.findByPlayerAndMission(
        player,
        mission.requiredMission
      );
      // If required mission doesn't exist or if not completed, no progress
      if (!requiredPlayerMission || !requiredPlayerMission.completed) {
        return false;
      }
    }
    return true;
  }

  /**
   * Increments progress of the specified mission by updating the progress field or creating a new entity if not exists
   * @param playerId
   * @param missionId
   */
  async incrementProgress(
    playerId: string,
    missionId: string
  ): Promise<PlayerMissionEntity> {
    const player = await this.playerEntityService.getById(playerId);
    const mission = await this.missionEntityService.getByIdJoinAll(missionId);

    const playerMission = await this.playerMissionEntityService.findByPlayerAndMission(
      player,
      mission
    );

    // If player hasn't started mission
    if (!playerMission) {
      return this.createPlayerMission(player, mission);
    }

    // Progress mission
    if (!playerMission.completed) {
      return this.progressPlayerMission(playerMission, mission);
    }
    // If player already completed mission, do nothing
    return;
  }

  private async createPlayerMission(
    player: PlayerEntity,
    mission: MissionEntity
  ): Promise<PlayerMissionEntity> {
    this.logger.log(
      `Player: ${player.id} starting mission: ${mission.id}, new PlayerMissionEntity being created`
    );
    const createPlayerMissionDto: CreatePlayerMissionDto = {
      mission,
      player,
    };
    const createdPlayerMission = await this.playerMissionEntityService.create(
      createPlayerMissionDto
    );
    this.emitMissionCompletedEventIfCompleted(mission, createdPlayerMission);
    return createdPlayerMission;
  }

  private async progressPlayerMission(
    playerMission: PlayerMissionEntity,
    mission: MissionEntity
  ): Promise<PlayerMissionEntity> {
    const updatedPlayerMission = await this.playerMissionEntityService.updateByEntityId(
      playerMission.id,
      {
        ...playerMission,
        currentProgress: playerMission.currentProgress + 1,
      }
    );
    this.emitMissionCompletedEventIfCompleted(mission, updatedPlayerMission);
    return updatedPlayerMission;
  }

  private emitMissionCompletedEventIfCompleted(
    mission: MissionEntity,
    playerMission: PlayerMissionEntity
  ): void {
    if (playerMission.currentProgress == mission.maxProgress) {
      this.eventEmitter.emit("mission.completed", {
        mission,
        playerMission,
      });
    }
  }
}

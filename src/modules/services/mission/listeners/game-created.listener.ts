import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { GameCreatedEvent } from "../../../common/events/game-created.event";
import { PlayerMissionEntityService } from "../../../entities/playerMission/player-mission.entity.service";
import { MissionEntityService } from "../../../entities/mission/mission.entity.service";
import { MissionService } from "../mission.service";
import { VenueTagEntityService } from "../../../entities/venueTag/venue-tag.entity.service";
import { GameEntity } from "../../../entities/game/game.entity";
import { MissionEntity } from "../../../entities/mission/mission.entity";
import { CriteriaType } from "../../../entities/mission/criteria.type";

@Injectable()
export class GameCreatedListener {
  constructor(
    private readonly missionService: MissionService,
    private readonly missionEntityService: MissionEntityService,
    private readonly playerMissionEntityService: PlayerMissionEntityService,
    private readonly venueTagsEntityService: VenueTagEntityService
  ) {}

  @OnEvent(GameCreatedEvent.EVENT, { async: true })
  async handleGameCreatedEvent(event: GameCreatedEvent) {
    // handle and process "GameCreatedEvent" event
    const game = event.game;
    await this.progressTagCountMissions(game);
    await this.progressGameScoreMissions(game);
  }

  private async progressGameScoreMissions(game: GameEntity): Promise<void> {
    const gameScoreMissions = await this.missionEntityService.findGameScoreMissions();
    for (const gameScoreMission of gameScoreMissions) {
      switch (gameScoreMission.criteriaType) {
        case CriteriaType.GAME_SCORE:
          if (game.score >= +gameScoreMission.criteriaValue) {
            await this.progressMissionIfDoable(game, gameScoreMission);
          }
          break;
        case CriteriaType.GAME_SCORE_VENUE:
          if (
            gameScoreMission.criteriaRefId == game.venue.id &&
            game.score >= +gameScoreMission.criteriaValue
          ) {
            await this.progressMissionIfDoable(game, gameScoreMission);
          }
          break;
      }
    }
  }

  private async progressTagCountMissions(game: GameEntity): Promise<void> {
    const venueTags = await this.venueTagsEntityService.findByVenueId(
      game.venue.id
    );
    for (const venueTag of venueTags) {
      const missionsWithTag = await this.missionEntityService.findByTag(
        venueTag.tag.id
      );
      for (const missionWithTag of missionsWithTag) {
        await this.progressMissionIfDoable(game, missionWithTag);
      }
    }
  }

  private async progressMissionIfDoable(
    game: GameEntity,
    mission: MissionEntity
  ): Promise<void> {
    const missionDoable = await this.missionService.checkIfMissionRequirementFulfilled(
      game.player,
      mission
    );
    if (missionDoable) {
      await this.missionService.incrementProgress(game.player.id, mission.id);
    }
  }
}

import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { GameCreatedEvent } from "../../../common/events/game-created.event";
import { LeaderboardService } from "../leaderboard.service";
import { VenueEntityService } from "../../../entities/venue/venue.entity.service";

@Injectable()
export class GameCreatedListener {
  constructor(
    private readonly leaderboardService: LeaderboardService,
    private readonly venueEntityService: VenueEntityService
  ) {}

  @OnEvent(GameCreatedEvent.EVENT, { async: true })
  async handleGameCreatedEvent(event: GameCreatedEvent) {
    // handle and process "GameCreatedEvent" event
    const venue = await this.venueEntityService.getByIdJoinZone(event.game.venue.id);
    // Refresh Venue, Zone and Season Leaderboard
    await this.leaderboardService.refreshVenueLeaderboard(venue.id);
    await this.leaderboardService.refreshZoneLeaderboard(venue.zone.id);
    // TODO: season id
    await this.leaderboardService.refreshSeasonLeaderboard("SEASON");
  }
}

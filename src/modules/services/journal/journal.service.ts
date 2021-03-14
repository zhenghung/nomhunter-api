import { Injectable, Logger } from "@nestjs/common";
import { PlayerBadgeEntityService } from "../../entities/playerBadge/player-badge.entity.service";
import { BadgeEntityService } from "../../entities/badge/badge.entity.service";
import { HistoryGameInterface } from "./interface/history-game.interface";
import { BadgeEntity } from "../../entities/badge/badge.entity";
import { MyBadgeInterface } from "./interface/my-badge.interface";

@Injectable()
export class JournalService {
  private logger: Logger = new Logger(JournalService.name);

  constructor(
    private readonly playerBadgeEntityService: PlayerBadgeEntityService,
    private readonly badgeEntityService: BadgeEntityService
  ) {}

  /**
   * Find all badges and merge with player badges
   * @param playerId
   */
  async fetchMyPlayerBadges(playerId: string): Promise<MyBadgeInterface[]> {
    this.logger.log("Fetching all badges...");
    const allBadges = await this.badgeEntityService.findAll(true);
    this.logger.log("Fetching player badges...");
    const myBadges = await this.badgeEntityService.findByJoinPlayerBadges(
      playerId
    );
    // Convert myBadges to a Map with key badgeId
    const myBadgesMap = new Map<string, BadgeEntity>();
    myBadges.forEach((badge) => {
      myBadgesMap.set(badge.id, badge);
    });
    this.logger.log("Merging badges for response");
    // Merge all Badges with playerBadges and map to Response
    return allBadges
      .map((badge: BadgeEntity) => {
        return {
          ...badge,
          playerBadges: myBadgesMap.has(badge.id)
            ? myBadgesMap.get(badge.id).playerBadges
            : [],
        };
      })
      .map((badge: BadgeEntity) => {
        const myBadge: MyBadgeInterface = {
          badgeId: badge.id,
          badgeName: badge.name,
          badgeDescription: badge.description,
          badgeFileUrl: badge.file.url,
          badgeCount: badge.playerBadges.length,
          badgeGames: badge.playerBadges.map((playerBadge) => {
            return {
              date: playerBadge.createdAt,
              score: playerBadge.game.score,
              venueName: playerBadge.game.venue.name,
              zoneName: playerBadge.game.venue.zone.name,
            };
          }),
        };
        return myBadge;
      });
  }

  /**
   * Fetch Player Games history
   * @param playerId
   */
  async fetchHistory(playerId: string): Promise<HistoryGameInterface[]> {
    this.logger.log("Fetching PlayerBadges History");
    const playerBadges = await this.playerBadgeEntityService.findByPlayerId(
      playerId
    );
    // Map playerBadges to response
    return playerBadges.map((playerBadge) => {
      const mappedResponse: HistoryGameInterface = {
        date: playerBadge.createdAt,
        venueName: playerBadge.game.venue.name,
        zoneName: playerBadge.game.venue.zone.name,
        score: playerBadge.game.score,
        badgeId: playerBadge.badge.id,
        badgeName: playerBadge.badge.name,
        badgeFileUrl: playerBadge.badge.file.url,
        badgeDescription: playerBadge.badge.description,
      };
      return mappedResponse;
    });
  }
}

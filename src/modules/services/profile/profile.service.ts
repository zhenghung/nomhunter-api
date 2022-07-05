import { Injectable, Logger } from "@nestjs/common";
import { PlayerEntityService } from "../../entities/player/player.entity.service";
import { AvatarService } from "../avatar/avatar.service";
import { ProfileResponseInterface } from "./interface/profile-response.interface";
import { JournalService } from "../journal/journal.service";
import { ProfileBadgesInterface } from "./interface/profile-badges.interface";
import { ProfileRankZonesInterface } from "./interface/profile-zone-ranks.interface";
import { LeaderboardService } from "../leaderboard/leaderboard.service";
import { LeaderboardType } from "../leaderboard/leaderboard.type";
import { ZoneEntityService } from "../../entities/zone/zone.entity.service";
import { RankInterface } from "../leaderboard/interface/rank.interface";
import { PlayerMissionEntityService } from "../../entities/playerMission/player-mission.entity.service";
import { ProfileRankInterface } from "./interface/profile-rank.interface";
import { MyBadgeInterface } from "../journal/interface/my-badge.interface";
import { PlayerWalletEntityService } from "../../entities/playerWallet/player-wallet.entity.service";

@Injectable()
export class ProfileService {
  private logger: Logger = new Logger(ProfileService.name);

  constructor(
    private readonly playersService: PlayerEntityService,
    private readonly avatarService: AvatarService,
    private readonly journalService: JournalService,
    private readonly leaderboardService: LeaderboardService,
    private readonly zoneEntityService: ZoneEntityService,
    private readonly playerMissionEntityService: PlayerMissionEntityService,
    private readonly playerWalletEntityService: PlayerWalletEntityService
  ) {}

  /**
   * Fetch profile
   */
  async getProfile(playerId: string, isOtherPlayer: boolean): Promise<ProfileResponseInterface> {
    this.logger.log(`Getting profile of player: ${playerId}`);

    const nickname = await this.playersService.getById(playerId).then((playerEntity) => playerEntity.nickname);
    const avatarUrl = await this.avatarService.getPlayerAvatar(playerId).then((avatar) => avatar.imageUrl);
    const venuesVisited = await this.journalService.fetchVenues(playerId).then((venues) => venues.length);
    const pointsEarned = await this.journalService
      .fetchHistory(playerId)
      .then((gameHistory) => gameHistory.reduce((a, b) => a + b.score, 0));
    const badges = await this.journalService.fetchMyPlayerBadges(playerId);
    const badgesEarned = badges.filter((badge) => badge.badgeCount > 0).length;
    const completedMissionsCount = await this.playerMissionEntityService
      .findByPlayer(playerId)
      .then((missions) => missions.filter((mission) => mission.completed).length);

    return {
      playerId: playerId,
      nickname: nickname,
      avatarUrl: avatarUrl,
      exp: { current: null, max: null },
      venuesVisited: venuesVisited,
      pointsEarned: pointsEarned,
      badgesEarned: badgesEarned,
      completedMissions: completedMissionsCount,
      nomCoins: isOtherPlayer
        ? null
        : await this.playerWalletEntityService.findByPlayerId(playerId).then((wallet) => wallet.amount),
      rankings: await this.getRanks(playerId),
      badges: isOtherPlayer ? ProfileService.getTopBadges(badges) : null,
    };
  }

  /**
   * Fetch profile badges
   */
  private static getTopBadges(badges: MyBadgeInterface[]): ProfileBadgesInterface[] {
    return badges
      .sort(ProfileService.sortFunction("badgeCount", false))
      .slice(0, 4)
      .map((badge) => {
        return {
          id: badge.badgeId,
          imageUrl: badge.badgeFileUrl,
          count: badge.badgeCount,
        };
      });
  }

  /**
   * Fetch profile ranks
   */
  private async getRanks(playerId: string): Promise<ProfileRankInterface> {
    //Zones
    const listOfZones = await this.zoneEntityService.findAll();
    const listOfZoneRanks: ProfileRankZonesInterface[] = await Promise.all(
      listOfZones.map((zoneEntity) =>
        this.leaderboardService.getLeaderboard(LeaderboardType.ZONE, zoneEntity.id).then((rankList) => {
          const myRank = rankList.filter((rank) => rank.playerId == playerId).pop();
          return {
            id: zoneEntity.id,
            name: zoneEntity.name,
            rank: myRank ? myRank.rank : null,
          };
        })
      )
    );
    //get the zones with the highest ranks
    const listOfTopZoneRanks = listOfZoneRanks.sort(ProfileService.sortFunction("rank", true)).slice(0, 3);

    //season rank
    const seasonRank: RankInterface = await this.leaderboardService
      .getLeaderboard(LeaderboardType.SEASON, "SEASON")
      .then((rankList) => rankList.filter((rank) => rank.playerId == playerId).pop());

    return {
      season: seasonRank ? seasonRank.rank : null,
      zones: listOfTopZoneRanks,
    };
  }

  private static sortFunction(property: string, ascending: boolean) {
    return (a, b) => {
      if (a[property] === b[property]) {
        return 0;
      }
      return ascending ? (a[property] < b[property] ? -1 : 1) : a[property] > b[property] ? -1 : 1;
    };
  }
}

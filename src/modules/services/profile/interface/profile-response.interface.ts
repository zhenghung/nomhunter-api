import { ProfileBadgesInterface } from "./profile-badges.interface";
import { ProfileRankInterface } from "./profile-rank.interface";

export interface ProfileResponseInterface {
  playerId: string;
  nickname: string;
  avatarUrl: string;
  exp: { current: number; max: number };
  venuesVisited: number;
  pointsEarned: number;
  badgesEarned: number;
  completedMissions: number;
  nomCoins: number;
  rankings: ProfileRankInterface;
  badges?: ProfileBadgesInterface[];
}

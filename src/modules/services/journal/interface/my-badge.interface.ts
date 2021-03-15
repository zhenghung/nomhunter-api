import { MyBadgeGameInterface } from "./my-badge-game.interface";

export interface MyBadgeInterface {
  badgeId: string;
  badgeName: string;
  badgeDescription: string;
  badgeFileUrl: string;
  badgeCount: number;
  badgeGames: MyBadgeGameInterface[];
}

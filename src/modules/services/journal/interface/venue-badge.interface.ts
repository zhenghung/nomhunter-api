import { MyBadgeGameInterface } from "./my-badge-game.interface";

export interface VenueBadgeInterface {
  venueId: string;
  venueName: string;
  venueDescription: string;
  venueLatitude: string;
  venueLongitude: string;
  venuePhotoReference: string;
  venueGooglePlacesId: string;
  ranked: boolean;
  badgeId: string;
  badgeName: string;
  badgeDescription: string;
  badgeFileUrl: string;
  badgeGames: MyBadgeGameInterface[];
}

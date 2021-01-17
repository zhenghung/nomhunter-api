import { PlayerInterface } from "./player.interface";

export interface VenueInterface {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  googlePlacesId: string;
  photoReference: string;
  description: string;
  ranked: boolean;
  visited: boolean;
  topPlayer: PlayerInterface;
}

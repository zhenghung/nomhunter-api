import { VenueInterface } from "./venue.interface";

export interface ZoneInterface {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  venues: VenueInterface[];
}

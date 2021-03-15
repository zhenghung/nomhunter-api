import { Injectable, Logger } from "@nestjs/common";
import { createQueryBuilder } from "typeorm";
import { ZoneEntity } from "../../entities/zone/zone.entity";
import { ZoneInterface } from "./interface/zone.interface";
import { VenueInterface } from "./interface/venue.interface";

@Injectable()
export class LiveService {
  private readonly logger = new Logger(LiveService.name);

  /**
   * Fetch all active zones and venues
   */
  async getLiveZonesAndVenues(): Promise<ZoneInterface[]> {
    const queryData = await this.queryZonesAndVenues();
    return this.mapQueryToInterface(queryData);
  }

  /**
   * Maps the entity retrieved into respond interface schema
   * @param queryData {@link ZoneEntity} List of ZoneEntities retrieved from DB
   * @return {@link ZoneInterface} List of zones with less data
   */
  private mapQueryToInterface(queryData: ZoneEntity[]): ZoneInterface[] {
    const response: ZoneInterface[] = [];
    for (let i = 0; i < queryData.length; i++) {
      const venues = [];
      for (let j = 0; j < queryData[i].venues.length; j++) {
        const venue: VenueInterface = {
          id: queryData[i].venues[j].id,
          name: queryData[i].venues[j].name,
          latitude: queryData[i].venues[j].latitude,
          longitude: queryData[i].venues[j].longitude,
          googlePlacesId: queryData[i].venues[j].googlePlacesId,
          photoReference: queryData[i].venues[j].photoReference,
          description: queryData[i].venues[j].description,
          //TODO: last 3 fields stubbed for now - placeholder till leaderboard epic is implemented
          ranked: Math.random() >= 0.5,
          visited: Math.random() >= 0.5,
          topPlayer: {
            id: "00309",
            name: "Pineapple Guy",
            avatarUrl:
              "https://nomhunter-dev.s3.eu-west-2.amazonaws.com/avatar/profile/1-2-2.png",
          },
        };
        venues.push(venue);
      }
      const zone: ZoneInterface = {
        id: queryData[i].id,
        name: queryData[i].name,
        latitude: queryData[i].latitude,
        longitude: queryData[i].longitude,
        venues: venues,
      };
      response.push(zone);
    }
    return response;
  }

  // TODO Add filter for current season only
  private queryZonesAndVenues(): Promise<ZoneEntity[]> {
    return createQueryBuilder(ZoneEntity, "zone")
      .select([
        "zone.id",
        "zone.name",
        "zone.latitude",
        "zone.longitude",
        "venue.id",
        "venue.name",
        "venue.latitude",
        "venue.longitude",
        "venue.googlePlacesId",
        "venue.photoReference",
        "venue.description",
      ])
      .innerJoin("zone.venues", "venue")
      .getMany();
  }
}

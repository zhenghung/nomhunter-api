import { ApiProperty } from "@nestjs/swagger";
import { ZoneEntity } from "../../zone/zone.entity";
import { BadgeEntity } from "../../badge/badge.entity";

export class CreateVenueDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  latitude: string;

  @ApiProperty()
  longitude: string;

  @ApiProperty()
  googlePlacesId: string;

  @ApiProperty()
  photoReference: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  zone: ZoneEntity;

  @ApiProperty()
  badge: BadgeEntity;
}

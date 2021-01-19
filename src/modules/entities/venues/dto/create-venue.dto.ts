import { ApiProperty } from "@nestjs/swagger";
import { ZoneEntity } from "../../zones/zone.entity";

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
}

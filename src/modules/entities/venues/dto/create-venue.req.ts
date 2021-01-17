import { ApiProperty } from "@nestjs/swagger";

export class CreateVenueReq {
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
  zone_id: string;
}

import { ApiProperty } from "@nestjs/swagger";

export class CreateVenueReq {
  @ApiProperty()
  name: string;

  @ApiProperty()
  googlePlacesId: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  zone_id: string;
}

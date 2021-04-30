import { ApiProperty } from "@nestjs/swagger";

export class CreateVenueTagReq {
  @ApiProperty()
  venueId: string;

  @ApiProperty()
  tags: string[];
}

import { ApiProperty } from "@nestjs/swagger";

export class CreateZoneDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  latitude: string;

  @ApiProperty()
  longitude: string;
}

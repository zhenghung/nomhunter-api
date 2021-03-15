import { ApiProperty } from "@nestjs/swagger";

export class CreateGameReq {
  @ApiProperty()
  venueId: string;

  @ApiProperty()
  score: number;
}

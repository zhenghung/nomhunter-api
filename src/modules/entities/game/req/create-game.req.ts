import { ApiProperty } from "@nestjs/swagger";

export class CreateGameReq {
  @ApiProperty()
  playerId: string;

  @ApiProperty()
  venueId: string;

  @ApiProperty()
  score: number;
}

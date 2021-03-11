import { ApiProperty } from "@nestjs/swagger";

export class CreateGameReq {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  venueId: string;

  @ApiProperty()
  score: number;
}

import { ApiProperty } from "@nestjs/swagger";

export class CreatePlayerBadgeReq {
  @ApiProperty()
  playerId: string;

  @ApiProperty()
  badgeId: string;

  @ApiProperty()
  gameId: string;
}

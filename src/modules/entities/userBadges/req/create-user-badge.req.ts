import { ApiProperty } from "@nestjs/swagger";

export class CreateUserBadgeReq {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  badgeId: string;

  @ApiProperty()
  gameId: string;
}

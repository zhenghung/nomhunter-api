import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "../../user/user.entity";
import { VenueEntity } from "../../venue/venue.entity";

export class CreateGameDto {
  @ApiProperty()
  user: UserEntity;

  @ApiProperty()
  venue: VenueEntity;

  @ApiProperty()
  score: number;
}

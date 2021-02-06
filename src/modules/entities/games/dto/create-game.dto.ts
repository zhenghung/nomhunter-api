import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "../../users/user.entity";
import { VenueEntity } from "../../venues/venue.entity";

export class CreateGameDto {
  @ApiProperty()
  user: UserEntity;

  @ApiProperty()
  venue: VenueEntity;

  @ApiProperty()
  score: number;
}

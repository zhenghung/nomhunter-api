import { ApiProperty } from "@nestjs/swagger";
import { PlayerEntity } from "../../player/player.entity";
import { VenueEntity } from "../../venue/venue.entity";

export class CreateGameDto {
  @ApiProperty()
  player: PlayerEntity;

  @ApiProperty()
  venue: VenueEntity;

  @ApiProperty()
  score: number;
}

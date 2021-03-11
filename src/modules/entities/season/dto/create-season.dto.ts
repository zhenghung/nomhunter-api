import { ApiProperty } from "@nestjs/swagger";

export class CreateSeasonDto {
  @ApiProperty()
  startDate: Date;
}

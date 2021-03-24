import { ApiProperty } from "@nestjs/swagger";

export class CreatePlayerDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  nickname: string;
}

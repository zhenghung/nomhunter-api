import { ApiProperty } from "@nestjs/swagger";

export class CreateMissionGroupReq {
  @ApiProperty()
  name: string;
}

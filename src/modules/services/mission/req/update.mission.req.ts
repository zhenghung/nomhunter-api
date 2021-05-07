import { ApiProperty } from "@nestjs/swagger";

export class UpdateMissionReq {
  @ApiProperty()
  action: string;
}

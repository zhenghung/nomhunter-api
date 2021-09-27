import { ApiProperty } from "@nestjs/swagger";
import { GearType } from "../gear.type";

export class CreateGearReq {
  @ApiProperty()
  fileId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  type: GearType;
}

import { ApiProperty } from "@nestjs/swagger";

export class CreateGearMappingReq {
  @ApiProperty()
  gearId: string;

  @ApiProperty()
  avatarPoseId: string;

  @ApiProperty()
  transformX: number;

  @ApiProperty()
  transformY: number;

  @ApiProperty()
  transformRotation: number;
}

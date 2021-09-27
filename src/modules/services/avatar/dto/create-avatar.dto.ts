import { ApiProperty } from "@nestjs/swagger";

export class CreateAvatarDto {
  @ApiProperty()
  poseId: string;

  @ApiProperty()
  faceId: string;

  @ApiProperty()
  hatId: string;

  @ApiProperty()
  weaponId: string;

  @ApiProperty()
  color: string;
}

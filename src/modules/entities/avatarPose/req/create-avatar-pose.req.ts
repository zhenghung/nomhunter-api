import { ApiProperty } from "@nestjs/swagger";

export class CreateAvatarPoseReq {
  @ApiProperty()
  poseOutlineFileId: string;
  @ApiProperty()
  poseSilhouetteFileId: string;
  @ApiProperty()
  poseHandOutlineFileId: string;
  @ApiProperty()
  poseHandSilhouetteFileId: string;
}

import { FileEntity } from "../../file/file.entity";

export class CreateAvatarPoseDto {
  poseSilhouette: FileEntity;
  poseOutline: FileEntity;
  poseHandSilhouette: FileEntity;
  poseHandOutline: FileEntity;
  file: FileEntity;
}

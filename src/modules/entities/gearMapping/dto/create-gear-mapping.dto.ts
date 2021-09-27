import { GearEntity } from "../../gear/gear.entity";
import { AvatarPoseEntity } from "../../avatarPose/avatar-pose.entity";

export class CreateGearMappingDto {
  gear: GearEntity;
  avatarPose: AvatarPoseEntity;
  transformX: number;
  transformY: number;
  transformRotation: number;
}

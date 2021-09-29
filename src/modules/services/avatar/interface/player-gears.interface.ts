import { GearEntity } from "../../../entities/gear/gear.entity";
import { AvatarPoseEntity } from "../../../entities/avatarPose/avatar-pose.entity";

export interface PlayerGearsInterface {
  poses: AvatarPoseEntity[];
  colors: string[];
  hats: GearEntity[];
  faces: GearEntity[];
  weapons: GearEntity[];
}

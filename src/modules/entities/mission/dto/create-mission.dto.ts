import { GearEntity } from "../../gear/gear.entity";
import { MissionType } from "../mission.type";
import { TagEntity } from "../../tag/tag.entity";
import { MissionEntity } from "../mission.entity";

export class CreateMissionDto {
  name: string;
  description: string;
  type: MissionType;
  tag: TagEntity;
  maxProgress: number;
  rewardCoin: number;
  rewardExp: number;
  rewardGear: GearEntity;
  requiredMission: MissionEntity;
}

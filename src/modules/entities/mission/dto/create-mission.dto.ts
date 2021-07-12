import { GearEntity } from "../../gear/gear.entity";
import { CriteriaType } from "../criteria.type";
import { MissionGroupEntity } from "../../missionGroup/mission-group.entity";

export class CreateMissionDto {
  name: string;
  description: string;
  maxProgress: number;
  level: number;
  missionGroup: MissionGroupEntity;
  criteriaType: CriteriaType;
  criteriaValue: string;
  criteriaRefId: string;
  rewardCoin: number;
  rewardExp: number;
  rewardGear: GearEntity;
}

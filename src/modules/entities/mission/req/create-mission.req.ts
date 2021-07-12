import { ApiProperty } from "@nestjs/swagger";
import { CriteriaType } from "../criteria.type";

export class CreateMissionReq {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  maxProgress: number;

  @ApiProperty()
  level: number;

  @ApiProperty()
  missionGroupId: string;

  @ApiProperty()
  criteriaType: CriteriaType;

  @ApiProperty()
  criteriaValue: string;

  @ApiProperty()
  criteriaRefId: string;

  @ApiProperty()
  rewardCoin: number;

  @ApiProperty()
  rewardExp: number;

  @ApiProperty()
  rewardGearId: string;
}

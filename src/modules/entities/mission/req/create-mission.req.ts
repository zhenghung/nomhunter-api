import { ApiProperty } from "@nestjs/swagger";
import { MissionType } from "../mission.type";

export class CreateMissionReq {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  type: MissionType;

  @ApiProperty()
  tagId: string;

  @ApiProperty()
  maxProgress: number;

  @ApiProperty()
  rewardCoin: number;

  @ApiProperty()
  rewardExp: number;

  @ApiProperty()
  rewardGearId: string;

  @ApiProperty()
  requiredMissionId: string;
}

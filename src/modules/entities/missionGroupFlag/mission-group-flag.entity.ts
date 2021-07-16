import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { PlayerEntity } from "../player/player.entity";
import { MissionGroupEntity } from "../missionGroup/mission-group.entity";

@Entity("mission_group_flag")
@Unique(["player", "missionGroup"])
export class MissionGroupFlagEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @ManyToOne(() => PlayerEntity, (player) => player.missionGroupFlags)
  @JoinColumn({ name: "player_id" })
  player: PlayerEntity;

  @ApiProperty()
  @ManyToOne(
    () => MissionGroupEntity,
    (missionGroup) => missionGroup.missionGroupFlags
  )
  @JoinColumn({ name: "mission_group_id" })
  missionGroup: MissionGroupEntity;
}

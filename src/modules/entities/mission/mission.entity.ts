import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { PlayerMissionEntity } from "../playerMission/player-mission.entity";
import { GearEntity } from "../gear/gear.entity";
import { CriteriaType } from "./criteria.type";
import { MissionGroupEntity } from "../missionGroup/mission-group.entity";

@Entity("mission")
@Unique(["missionGroup", "level"])
export class MissionEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  maxProgress: number;

  @ApiProperty()
  @Column({ default: 1 })
  level: number;

  @ApiProperty()
  @ManyToOne(() => MissionGroupEntity, (missionGroupEntity) => missionGroupEntity.missions)
  @JoinColumn({ name: "mission_group_id", referencedColumnName: "id" })
  missionGroup: MissionGroupEntity;

  @ApiProperty()
  @Column("enum", { name: "criteria_type", enum: CriteriaType })
  criteriaType: CriteriaType;

  @ApiProperty()
  @Column({ name: "criteria_value", nullable: true })
  criteriaValue: string;

  @ApiProperty()
  @Column({ name: "criteria_ref_id", type: "uuid", nullable: true })
  criteriaRefId: string;

  @ApiProperty()
  @Column()
  rewardCoin: number;

  @ApiProperty()
  @Column()
  rewardExp: number;

  @ApiProperty({ name: "reward_gear_id" })
  @ManyToOne(() => GearEntity, (gearEntity) => gearEntity.missions, {
    nullable: true,
  })
  @JoinColumn({ name: "reward_gear_id", referencedColumnName: "id" })
  rewardGear: GearEntity;

  @OneToMany(() => PlayerMissionEntity, (playerMission) => playerMission.mission)
  playerMissions: PlayerMissionEntity[];
}

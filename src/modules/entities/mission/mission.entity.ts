import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { PlayerMissionEntity } from "../playerMission/player-mission.entity";
import { GearEntity } from "../gear/gear.entity";
import { MissionType } from "./mission.type";
import { TagEntity } from "../tag/tag.entity";

@Entity("mission")
export class MissionEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ name: "required_mission_id" })
  @ManyToOne(() => MissionEntity, (mission) => mission.missions, {
    nullable: true,
  })
  @JoinColumn({ name: "required_mission_id" })
  requiredMission: MissionEntity;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column("enum", { enum: MissionType })
  type: MissionType;

  @ApiProperty({ name: "tag_id" })
  @ManyToOne(() => TagEntity, (tag) => tag.missions)
  @JoinColumn({ name: "tag_id" })
  tag: TagEntity;

  @ApiProperty()
  @Column()
  maxProgress: number;

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
  @JoinColumn({ name: "reward_gear_id" })
  rewardGear: GearEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => PlayerMissionEntity,
    (playerMission) => playerMission.mission
  )
  playerMissions: PlayerMissionEntity[];

  @OneToMany(() => MissionEntity, (mission) => mission.requiredMission)
  missions: PlayerMissionEntity[];
}

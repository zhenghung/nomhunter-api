import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { PlayerEntity } from "../player/player.entity";
import { MissionEntity } from "../mission/mission.entity";

@Entity("player_mission")
@Unique(["player", "mission"])
export class PlayerMissionEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ name: "player_id" })
  @ManyToOne(() => PlayerEntity, (playerEntity) => playerEntity.playerMissions)
  @JoinColumn({ name: "player_id" })
  player: PlayerEntity;

  @ApiProperty({ name: "mission_id" })
  @ManyToOne(
    () => MissionEntity,
    (missionEntity) => missionEntity.playerMissions
  )
  @JoinColumn({ name: "mission_id" })
  mission: MissionEntity;

  @ApiProperty()
  @Column({ default: 1 })
  currentProgress: number;

  @ApiProperty()
  @Column({ default: false })
  completed: boolean;

  @ApiProperty()
  @Column({ default: false })
  claimed: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { GameEntity } from "../game/game.entity";
import { PlayerBadgeEntity } from "../playerBadge/player-badge.entity";
import { PlayerMissionEntity } from "../playerMission/player-mission.entity";
import { MissionGroupFlagEntity } from "../missionGroupFlag/mission-group-flag.entity";
import { PlayerAvatarEntity } from "../playerAvatar/player-avatar.entity";

@Entity("player")
export class PlayerEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  @Exclude()
  password: string;

  @ApiProperty()
  @Column()
  nickname: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => GameEntity, (game) => game.player)
  games: GameEntity[];

  @OneToMany(() => PlayerBadgeEntity, (playerBadge) => playerBadge.player)
  playerBadges: PlayerBadgeEntity[];

  @OneToMany(() => PlayerMissionEntity, (playerMission) => playerMission.player)
  playerMissions: PlayerMissionEntity[];

  @OneToMany(() => MissionGroupFlagEntity, (missionGroupFlagEntity) => missionGroupFlagEntity.player)
  missionGroupFlags: MissionGroupFlagEntity[];

  @OneToOne(() => PlayerAvatarEntity, (playerAvatar) => playerAvatar.player)
  avatar: PlayerAvatarEntity;
}

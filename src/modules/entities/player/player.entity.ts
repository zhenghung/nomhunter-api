import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { GameEntity } from "../game/game.entity";
import { PlayerBadgeEntity } from "../playerBadge/player-badge.entity";
import { PlayerMissionEntity } from "../playerMission/player-mission.entity";

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
  @Column({
    nullable: true,
  })
  profilePic: string;

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
}

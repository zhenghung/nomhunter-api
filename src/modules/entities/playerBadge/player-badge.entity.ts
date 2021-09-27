import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { PlayerEntity } from "../player/player.entity";
import { GameEntity } from "../game/game.entity";
import { BadgeEntity } from "../badge/badge.entity";

@Entity("player_badge")
export class PlayerBadgeEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ name: "player_id" })
  @ManyToOne(() => PlayerEntity, (playerEntity) => playerEntity.playerBadges)
  @JoinColumn({ name: "player_id", referencedColumnName: "id" })
  player: PlayerEntity;

  @ApiProperty({ name: "badge_id" })
  @ManyToOne(() => BadgeEntity, (badgeEntity) => badgeEntity.playerBadges)
  @JoinColumn({ name: "badge_id", referencedColumnName: "id" })
  badge: BadgeEntity;

  @ApiProperty({ name: "game_id" })
  @OneToOne(() => GameEntity, (gameEntity) => gameEntity.playerBadge)
  @JoinColumn({ name: "game_id", referencedColumnName: "id" })
  game: GameEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

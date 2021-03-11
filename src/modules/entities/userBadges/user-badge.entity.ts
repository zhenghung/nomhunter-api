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
import { UserEntity } from "../users/user.entity";
import { GameEntity } from "../games/game.entity";
import { BadgeEntity } from "../badges/badge.entity";

@Entity("user_badges")
export class UserBadgeEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ name: "user_id" })
  @ManyToOne(() => UserEntity, (userEntity) => userEntity.userBadges)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @ApiProperty({ name: "badge_id" })
  @ManyToOne(() => BadgeEntity, (badgeEntity) => badgeEntity.userBadges)
  @JoinColumn({ name: "badge_id" })
  badge: BadgeEntity;

  @ApiProperty({ name: "game_id" })
  @OneToOne(() => GameEntity, (gameEntity) => gameEntity.userBadge)
  @JoinColumn({ name: "game_id" })
  game: GameEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

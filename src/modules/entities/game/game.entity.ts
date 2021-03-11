import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "../user/user.entity";
import { VenueEntity } from "../venue/venue.entity";
import { UserBadgeEntity } from "../userBadge/user-badge.entity";

@Entity("game")
export class GameEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ name: "user_id" })
  @ManyToOne(() => UserEntity, (user) => user.games)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @ApiProperty()
  @Column()
  score: number;

  @ApiProperty({ name: "venue_id" })
  @ManyToOne(() => VenueEntity, (venue) => venue.games)
  @JoinColumn({ name: "venue_id" })
  venue: VenueEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => UserBadgeEntity, (userBadgeEntity) => userBadgeEntity.game)
  userBadge: UserBadgeEntity;
}

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { PlayerEntity } from "../player/player.entity";
import { VenueEntity } from "../venue/venue.entity";
import { PlayerBadgeEntity } from "../playerBadge/player-badge.entity";

@Entity("game")
export class GameEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ name: "player_id" })
  @ManyToOne(() => PlayerEntity, (player) => player.games)
  @JoinColumn({ name: "player_id", referencedColumnName: "id" })
  player: PlayerEntity;

  @ApiProperty()
  @Column()
  score: number;

  @ApiProperty({ name: "venue_id" })
  @ManyToOne(() => VenueEntity, (venue) => venue.games)
  @JoinColumn({ name: "venue_id", referencedColumnName: "id" })
  venue: VenueEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => PlayerBadgeEntity, (playerBadgeEntity) => playerBadgeEntity.game)
  playerBadge: PlayerBadgeEntity;
}

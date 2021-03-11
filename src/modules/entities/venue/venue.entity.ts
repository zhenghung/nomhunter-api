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
import { ZoneEntity } from "../zone/zone.entity";
import { GameEntity } from "../game/game.entity";
import { BadgeEntity } from "../badge/badge.entity";

@Entity("venue")
export class VenueEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  latitude: string;

  @ApiProperty()
  @Column()
  longitude: string;

  @ApiProperty()
  @Column()
  googlePlacesId: string;

  @ApiProperty()
  @Column()
  photoReference: string;

  @ApiProperty({ name: "zone_id" })
  @ManyToOne(() => ZoneEntity, (zone) => zone.venues)
  @JoinColumn({ name: "zone_id" })
  zone: ZoneEntity;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty({ name: "badge_id" })
  @ManyToOne(() => BadgeEntity, (badgeEntity) => badgeEntity.venue)
  @JoinColumn({ name: "badge_id" })
  badge: BadgeEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => GameEntity, (game) => game.venue)
  games: GameEntity[];
}

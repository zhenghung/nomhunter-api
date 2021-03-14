import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { FileEntity } from "../file/file.entity";
import { VenueEntity } from "../venue/venue.entity";
import { PlayerBadgeEntity } from "../playerBadge/player-badge.entity";

@Entity("badge")
export class BadgeEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ name: "file_id" })
  @OneToOne(() => FileEntity, (fileEntity) => fileEntity.badge)
  @JoinColumn({ name: "file_id" })
  file: FileEntity;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @OneToMany(
    () => PlayerBadgeEntity,
    (playerBadgeEntity) => playerBadgeEntity.badge
  )
  @JoinColumn()
  playerBadges: PlayerBadgeEntity[];

  @OneToMany(() => VenueEntity, (venueEntity) => venueEntity.badge)
  venue: VenueEntity[];
}

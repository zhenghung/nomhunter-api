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
import { FileEntity } from "../files/file.entity";
import { VenueEntity } from "../venues/venue.entity";
import { UserBadgeEntity } from "../userBadges/user-badge.entity";

@Entity("badges")
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

  @OneToMany(() => VenueEntity, (venueEntity) => venueEntity.badge)
  venue: VenueEntity[];

  @OneToMany(() => UserBadgeEntity, (userBadgeEntity) => userBadgeEntity.badge)
  userBadges: UserBadgeEntity[];
}

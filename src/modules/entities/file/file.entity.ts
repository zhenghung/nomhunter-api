import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BadgeEntity } from "../badge/badge.entity";

export enum FileType {
  PROFILE_PIC = "profile_pic",
  AVATAR_BODY = "avatar_body",
  AVATAR_HAT = "avatar_hat",
  AVATAR_PROP = "avatar_prop",
  BADGE = "badge",
}

@Entity("file")
export class FileEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column("enum", { enum: FileType })
  type: FileType;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  url: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => BadgeEntity, (badge) => badge.file)
  badge: BadgeEntity;
}

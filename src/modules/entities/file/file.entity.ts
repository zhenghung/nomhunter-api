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
import { GearEntity } from "../gear/gear.entity";
import { FileType } from "./file.type";

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

  @OneToOne(() => GearEntity, (gear) => gear.file)
  gear: GearEntity;
}

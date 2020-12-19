import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

export enum FileType {
  PROFILE_PIC,
  AVATAR_BODY,
  AVATAR_HAT,
  AVATAR_PROP,
}

@Entity()
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
}

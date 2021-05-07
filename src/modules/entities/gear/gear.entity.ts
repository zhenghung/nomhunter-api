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
import { MissionEntity } from "../mission/mission.entity";

@Entity("gear")
export class GearEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty({ name: "file_id" })
  @OneToOne(() => FileEntity, (fileEntity) => fileEntity.gear)
  @JoinColumn({ name: "file_id" })
  file: FileEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => MissionEntity, (mission) => mission.rewardGear)
  missions: MissionEntity[];
}

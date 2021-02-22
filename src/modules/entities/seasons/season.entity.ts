import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("seasons")
export class SeasonEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  startDate: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}

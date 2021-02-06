import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "../users/user.entity";
import { VenueEntity } from "../venues/venue.entity";

@Entity("games")
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
}

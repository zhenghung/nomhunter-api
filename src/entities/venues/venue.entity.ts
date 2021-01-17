import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { ZoneEntity } from "../zones/zone.entity";

@Entity("venues")
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

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

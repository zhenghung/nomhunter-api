import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { PlayerEntity } from "../player/player.entity";
import { GearEntity } from "../gear/gear.entity";
import { AvatarPoseEntity } from "../avatarPose/avatar-pose.entity";
import { FileEntity } from "../file/file.entity";

@Entity("player_avatar")
@Unique(["player"])
export class PlayerAvatarEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ name: "player_id" })
  @Index()
  @OneToOne(() => PlayerEntity, (playerEntity) => playerEntity.avatar)
  @JoinColumn({ name: "player_id", referencedColumnName: "id" })
  player: PlayerEntity;

  @ApiProperty({ name: "file_id" })
  @OneToOne(() => FileEntity, (fileEntity) => fileEntity.avatar)
  @JoinColumn({ name: "file_id", referencedColumnName: "id" })
  file: FileEntity;

  @ApiProperty({ name: "pose_id" })
  @ManyToOne(() => AvatarPoseEntity, (avatarPoseEntity) => avatarPoseEntity.playerAvatars)
  @JoinColumn({ name: "pose_id", referencedColumnName: "id" })
  pose: AvatarPoseEntity;

  @ApiProperty({ name: "face_id" })
  @ManyToOne(() => GearEntity, (gearEntity) => gearEntity.avatarFaces, {
    nullable: true,
  })
  @JoinColumn({ name: "face_id", referencedColumnName: "id" })
  face: GearEntity;

  @ApiProperty({ name: "hat_id" })
  @ManyToOne(() => GearEntity, (gearEntity) => gearEntity.avatarHats, {
    nullable: true,
  })
  @JoinColumn({ name: "hat_id", referencedColumnName: "id" })
  hat: GearEntity;

  @ApiProperty({ name: "weapon_id" })
  @ManyToOne(() => GearEntity, (gearEntity) => gearEntity.avatarWeapons, {
    nullable: true,
  })
  @JoinColumn({ name: "weapon_id", referencedColumnName: "id" })
  weapon: GearEntity;

  @ApiProperty()
  @Column()
  color: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

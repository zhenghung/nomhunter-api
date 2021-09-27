import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BadgeEntity } from "../badge/badge.entity";
import { GearEntity } from "../gear/gear.entity";
import { FileType } from "./file.type";
import { AvatarPoseEntity } from "../avatarPose/avatar-pose.entity";
import { PlayerAvatarEntity } from "../playerAvatar/player-avatar.entity";

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

  @OneToOne(() => PlayerAvatarEntity, (avatar) => avatar.file)
  avatar: PlayerAvatarEntity;

  @OneToOne(() => AvatarPoseEntity, (avatarPose) => avatarPose.poseSilhouette)
  poseSilhouette: AvatarPoseEntity;

  @OneToOne(() => AvatarPoseEntity, (avatarPose) => avatarPose.poseOutline)
  poseOutline: AvatarPoseEntity;

  @OneToOne(() => AvatarPoseEntity, (avatarPose) => avatarPose.poseHandSilhouette)
  poseHandSilhouette: AvatarPoseEntity;

  @OneToOne(() => AvatarPoseEntity, (avatarPose) => avatarPose.poseHandOutline)
  poseHandOutline: AvatarPoseEntity;
}

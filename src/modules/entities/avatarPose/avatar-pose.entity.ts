import { CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { FileEntity } from "../file/file.entity";
import { PlayerAvatarEntity } from "../playerAvatar/player-avatar.entity";
import { GearMappingEntity } from "../gearMapping/gear-mapping.entity";

@Entity("avatar_pose")
export class AvatarPoseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ name: "pose_silhouette_id" })
  @OneToOne(() => FileEntity, (fileEntity) => fileEntity.poseSilhouette)
  @JoinColumn({ name: "pose_silhouette_id", referencedColumnName: "id" })
  poseSilhouette: FileEntity;

  @ApiProperty({ name: "pose_outline_id" })
  @OneToOne(() => FileEntity, (fileEntity) => fileEntity.poseOutline)
  @JoinColumn({ name: "pose_outline_id", referencedColumnName: "id" })
  poseOutline: FileEntity;

  @ApiProperty({ name: "pose_hand_silhouette_id" })
  @OneToOne(() => FileEntity, (fileEntity) => fileEntity.poseHandSilhouette)
  @JoinColumn({ name: "pose_hand_silhouette_id", referencedColumnName: "id" })
  poseHandSilhouette: FileEntity;

  @ApiProperty({ name: "pose_hand_outline_id" })
  @OneToOne(() => FileEntity, (fileEntity) => fileEntity.poseHandOutline)
  @JoinColumn({ name: "pose_hand_outline_id", referencedColumnName: "id" })
  poseHandOutline: FileEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PlayerAvatarEntity, (playerAvatar) => playerAvatar.pose)
  playerAvatars: PlayerAvatarEntity[];

  @OneToMany(() => GearMappingEntity, (gearMapping) => gearMapping.avatarPose)
  gearMappings: GearMappingEntity[];
}

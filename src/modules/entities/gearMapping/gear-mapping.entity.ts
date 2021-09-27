import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { GearEntity } from "../gear/gear.entity";
import { AvatarPoseEntity } from "../avatarPose/avatar-pose.entity";

@Entity("gear_mapping")
export class GearMappingEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @ManyToOne(() => GearEntity, (gearEntity) => gearEntity.gearMappings)
  @JoinColumn({ name: "gear_id", referencedColumnName: "id" })
  gear: GearEntity;

  @ApiProperty()
  @ManyToOne(() => AvatarPoseEntity, (avatarPoseEntity) => avatarPoseEntity.gearMappings)
  @JoinColumn({ name: "avatar_pose_id", referencedColumnName: "id" })
  avatarPose: AvatarPoseEntity;

  @ApiProperty()
  @Column()
  transformX: number;

  @ApiProperty()
  @Column()
  transformY: number;

  @ApiProperty()
  @Column()
  transformRotation: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}

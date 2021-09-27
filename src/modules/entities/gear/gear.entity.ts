import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { FileEntity } from "../file/file.entity";
import { MissionEntity } from "../mission/mission.entity";
import { GearType } from "./gear.type";
import { PlayerAvatarEntity } from "../playerAvatar/player-avatar.entity";
import { GearMappingEntity } from "../gearMapping/gear-mapping.entity";

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

  @ApiProperty()
  @Column("enum", { enum: GearType })
  type: GearType;

  @ApiProperty({ name: "file_id" })
  @OneToOne(() => FileEntity, (fileEntity) => fileEntity.gear)
  @JoinColumn({ name: "file_id", referencedColumnName: "id" })
  file: FileEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => MissionEntity, (mission) => mission.rewardGear)
  missions: MissionEntity[];

  @OneToMany(() => PlayerAvatarEntity, (avatar) => avatar.face)
  avatarFaces: PlayerAvatarEntity[];

  @OneToMany(() => PlayerAvatarEntity, (avatar) => avatar.hat)
  avatarHats: PlayerAvatarEntity[];

  @OneToMany(() => PlayerAvatarEntity, (avatar) => avatar.weapon)
  avatarWeapons: PlayerAvatarEntity[];

  @OneToMany(() => GearMappingEntity, (gearMapping) => gearMapping.gear)
  gearMappings: GearMappingEntity[];
}

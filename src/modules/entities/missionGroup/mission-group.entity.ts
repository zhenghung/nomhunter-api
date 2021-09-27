import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { MissionEntity } from "../mission/mission.entity";
import { MissionGroupFlagEntity } from "../missionGroupFlag/mission-group-flag.entity";

@Entity("mission_group")
export class MissionGroupEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @OneToMany(() => MissionEntity, (missionEntity) => missionEntity.missionGroup)
  missions: MissionEntity[];

  @OneToMany(() => MissionGroupFlagEntity, (missionGroupFlagEntity) => missionGroupFlagEntity.missionGroup)
  missionGroupFlags: MissionGroupFlagEntity[];
}

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { PlayerEntity } from "../player/player.entity";

@Entity("player_wallet")
export class PlayerWalletEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  amount: number;

  @ApiProperty({ name: "player_id" })
  @Index()
  @OneToOne(() => PlayerEntity, (playerEntity) => playerEntity.wallet)
  @JoinColumn({ name: "player_id", referencedColumnName: "id" })
  player: PlayerEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("transaction")
export class TransactionEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column({ default: 0 })
  amount: number;

  @ApiProperty()
  @Column({ default: "NOM" })
  currency: string;

  @ApiProperty()
  @Column()
  sourceType: string;

  @ApiProperty()
  @Column({ nullable: true })
  sourceId: string;

  @ApiProperty()
  @Column()
  targetType: string;

  @ApiProperty()
  @Column({ nullable: true })
  targetId: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

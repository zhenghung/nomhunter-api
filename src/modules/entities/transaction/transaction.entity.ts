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

  @ApiProperty({ name: "shop_item_reserved_name" })
  @Column()
  shopItemReservedName: string;

  @ApiProperty()
  @Column()
  sourceId: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

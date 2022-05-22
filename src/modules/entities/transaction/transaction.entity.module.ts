import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionEntityService } from "./transaction.entity.service";
import { TransactionEntity } from "./transaction.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  providers: [TransactionEntityService],
  controllers: [],
  exports: [TransactionEntityService],
})
export class TransactionEntityModule {}

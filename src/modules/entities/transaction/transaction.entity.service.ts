import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GenericEntityService } from "../generic.entity.service";
import { TransactionEntity } from "./transaction.entity";

@Injectable()
export class TransactionEntityService extends GenericEntityService<TransactionEntity> {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionEntityRepository: Repository<TransactionEntity>
  ) {
    super(transactionEntityRepository, new Logger(TransactionEntityService.name), TransactionEntity.name);
  }
}

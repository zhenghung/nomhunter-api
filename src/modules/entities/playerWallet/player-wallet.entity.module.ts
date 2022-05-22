import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlayerWalletEntityService } from "./player-wallet.entity.service";
import { PlayerWalletEntity } from "./player-wallet.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PlayerWalletEntity])],
  providers: [PlayerWalletEntityService],
  controllers: [],
  exports: [PlayerWalletEntityService],
})
export class PlayerWalletEntityModule {}

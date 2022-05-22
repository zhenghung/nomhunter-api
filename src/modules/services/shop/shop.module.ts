import { Module } from "@nestjs/common";
import { ShopItemEntityModule } from "../../entities/shopItem/shop-item.entity.module";
import { TransactionEntityModule } from "../../entities/transaction/transaction.entity.module";
import { ShopService } from "./shop.service";
import { ShopController } from "./shop.controller";
import { PlayerWalletEntityModule } from "../../entities/playerWallet/player-wallet.entity.module";

@Module({
  imports: [ShopItemEntityModule, TransactionEntityModule, PlayerWalletEntityModule],
  providers: [ShopService],
  controllers: [ShopController],
})
export class ShopModule {}

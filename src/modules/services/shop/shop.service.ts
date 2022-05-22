import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ShopItemEntityService } from "../../entities/shopItem/shop-item.entity.service";
import { TransactionEntityService } from "../../entities/transaction/transaction.entity.service";
import { PlayerWalletEntityService } from "../../entities/playerWallet/player-wallet.entity.service";
import { PlayerWalletEntity } from "../../entities/playerWallet/player-wallet.entity";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { PlayerEntity } from "../../entities/player/player.entity";
import { TransactionEntity } from "../../entities/transaction/transaction.entity";
import { ShopItemObject } from "../../entities/shopItem/shop-item.object";
import { ShopItemsResponse } from "./res/shop-items.response";

@Injectable()
export class ShopService {
  private logger: Logger = new Logger(ShopService.name);

  constructor(
    private readonly shopItemEntityService: ShopItemEntityService,
    private readonly transactionEntityService: TransactionEntityService,
    private readonly playerWalletEntityService: PlayerWalletEntityService
  ) {}

  async getAllShopItems(): Promise<ShopItemsResponse> {
    const shopItems: ShopItemObject[] = this.shopItemEntityService.getAllShopItems();
    return {
      boxes: shopItems.filter((item) => item.type === "BOX"),
      chests: shopItems.filter((item) => item.type === "CHEST"),
      coins: shopItems.filter((item) => item.type === "COIN"),
    };
  }

  async purchaseItem(playerId: string, reservedName: string): Promise<void> {
    const shopItemEntity: ShopItemObject = await this.shopItemEntityService.getShopItemByReservedName(reservedName);
    const playerWalletEntity: PlayerWalletEntity = await this.playerWalletEntityService.findByPlayerId(playerId);
    playerWalletEntity.player = new PlayerEntity();
    playerWalletEntity.player.id = playerId;

    this.checkIfPlayerCanAffordItem(playerWalletEntity, shopItemEntity);

    const transactionEntity: TransactionEntity = new TransactionEntity();
    transactionEntity.shopItemReservedName = shopItemEntity.reservedName;
    transactionEntity.sourceId = playerWalletEntity.id;
    transactionEntity.amount = shopItemEntity.price.amount;
    transactionEntity.currency = shopItemEntity.price.currency;
    await this.transactionEntityService.create(transactionEntity);

    const newBalance: number = playerWalletEntity.amount - shopItemEntity.price.amount;

    this.logger.log(
      `Player[${playerId}] successfully bought shopItem[${reservedName}], new balance is now ${newBalance}`
    );
    await this.playerWalletEntityService.updateByEntityId(playerWalletEntity.id, {
      amount: newBalance,
    });
  }

  private checkIfPlayerCanAffordItem(wallet: PlayerWalletEntity, item: ShopItemObject): void {
    if (item.price.currency !== "NOM") {
      return;
    }
    if (wallet.amount < item.price.amount) {
      throw HttpExceptionsUtil.createHttpException(
        `Player ${wallet.player.id} cannot afford item ${item.reservedName}`,
        HttpStatus.PRECONDITION_FAILED,
        this.logger
      );
    }
  }
}

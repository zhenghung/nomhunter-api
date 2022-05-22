import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { SmallBoxShopItem } from "./items/box/small.box.shop-item";
import { MediumBoxShopItem } from "./items/box/medium.box.shop-item";
import { LargeBoxShopItem } from "./items/box/large.box.shop-item";
import { XLBoxShopItem } from "./items/box/xl.box.shop-item";
import { RareChestShopItem } from "./items/chest/rare.chest.shop-item";
import { RoyalChestShopItem } from "./items/chest/royal.chest.shop-item";
import { EpixChestShopItem } from "./items/chest/epix.chest.shop-item";
import { GodlikeChestShopItem } from "./items/chest/godlike.chest.shop-item";
import { CoinShopItems } from "./items/currency/coin-shop-items";
import { ShopItemObject } from "./shop-item.object";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";

@Injectable()
export class ShopItemEntityService {
  public logger: Logger = new Logger(ShopItemEntityService.name);

  private readonly shopItems: ShopItemObject[];

  constructor() {
    this.shopItems = [
      new SmallBoxShopItem().toObject(),
      new MediumBoxShopItem().toObject(),
      new LargeBoxShopItem().toObject(),
      new XLBoxShopItem().toObject(),
      new RareChestShopItem().toObject(),
      new EpixChestShopItem().toObject(),
      new RoyalChestShopItem().toObject(),
      new GodlikeChestShopItem().toObject(),
      ...new CoinShopItems().toObjects(),
    ];
  }

  public getAllShopItems(): ShopItemObject[] {
    return this.shopItems;
  }

  public getShopItemsByType(type: string): ShopItemObject[] {
    return this.shopItems.filter((item) => item.type === type);
  }

  public getShopItemByReservedName(reservedName: string): ShopItemObject {
    const shopItem: ShopItemObject[] = this.shopItems.filter((item) => item.reservedName === reservedName);
    if (shopItem.length === 0) {
      throw HttpExceptionsUtil.createHttpException(
        `Shop Item with reserved name ${reservedName} not found`,
        HttpStatus.BAD_REQUEST,
        this.logger
      );
    } else if (shopItem.length > 1) {
      throw HttpExceptionsUtil.createHttpException(
        "More than one shop items for the reservedName found",
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.logger
      );
    }
    return shopItem.pop();
  }
}

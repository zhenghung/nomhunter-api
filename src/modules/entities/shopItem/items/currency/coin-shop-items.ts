import { ShopItemObject } from "../../shop-item.object";

export class CoinShopItems {
  public toObjects(): ShopItemObject[] {
    return [
      {
        reservedName: "100_COINS",
        displayName: "100 coins",
        type: "COIN",
        imageName: null,
        imageUrl: null,
        price: {
          currency: "GBP",
          amount: 0.99,
        },
      },
      {
        reservedName: "500_COINS",
        displayName: "500 coins",
        type: "COIN",
        imageName: null,
        imageUrl: null,
        price: {
          currency: "GBP",
          amount: 2.99,
        },
      },
      {
        reservedName: "1000_COINS",
        displayName: "1000 coins",
        type: "COIN",
        imageName: null,
        imageUrl: null,
        price: {
          currency: "GBP",
          amount: 4.99,
        },
      },
      {
        reservedName: "5000_COINS",
        displayName: "5000 coins",
        type: "COIN",
        imageName: null,
        imageUrl: null,
        price: {
          currency: "GBP",
          amount: 10.99,
        },
      },
    ];
  }
}

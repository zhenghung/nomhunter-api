import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import JwtAuthGuard from "../auth/guard/jwt-auth.guard";
import { RequestWithPlayer } from "../auth/interface/request-with-player.interface";
import { ShopService } from "./shop.service";
import { ShopItemsResponse } from "./res/shop-items.response";

@ApiTags("Shop")
@Controller("shop")
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Fetch Shop items" })
  @ApiOkResponse({ description: "Shop Items retrieved successfully" })
  @UseGuards(JwtAuthGuard)
  @Get("items")
  async getShopItems(): Promise<ShopItemsResponse> {
    return this.shopService.getAllShopItems();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Buy Shop Item" })
  @ApiOkResponse({ description: "Item successfully purchased" })
  @UseGuards(JwtAuthGuard)
  @Post("/items/:shopItemReservedName/purchase")
  async purchaseItem(
    @Req() requestWithPlayer: RequestWithPlayer,
    @Param("shopItemReservedName") shopItemReservedName: string
  ): Promise<void> {
    return this.shopService.purchaseItem(requestWithPlayer.user.id, shopItemReservedName);
  }
}

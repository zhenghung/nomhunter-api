import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GenericEntityService } from "../generic.entity.service";
import { PlayerWalletEntity } from "./player-wallet.entity";
import { PlayerEntity } from "../player/player.entity";

@Injectable()
export class PlayerWalletEntityService extends GenericEntityService<PlayerWalletEntity> {
  constructor(
    @InjectRepository(PlayerWalletEntity)
    private readonly playerWalletEntityRepository: Repository<PlayerWalletEntity>
  ) {
    super(playerWalletEntityRepository, new Logger(PlayerWalletEntityService.name), PlayerWalletEntity.name);
  }

  findByPlayerId(playerId: string): Promise<PlayerWalletEntity> {
    return this.playerWalletEntityRepository
      .createQueryBuilder("playerWallet")
      .where("playerWallet.player.id = :id", { id: playerId })
      .getOneOrFail();
  }

  createNewPlayerWallet(player: PlayerEntity): Promise<PlayerWalletEntity> {
    return this.create({
      player: player,
      amount: 0,
    });
  }

  async addCoin(playerId: string, amount: number): Promise<PlayerWalletEntity> {
    const wallet = await this.findByPlayerId(playerId);
    return await this.updateByEntityId(wallet.id, {
      amount: wallet.amount + amount,
    });
  }
}

import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateVenueDto } from "./dto/create-venue.dto";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { VenueEntity } from "./venue.entity";
import { FindConditions } from "typeorm/find-options/FindConditions";

@Injectable()
export class VenueEntityService {
  private readonly logger = new Logger(VenueEntityService.name);

  constructor(
    @InjectRepository(VenueEntity)
    private readonly venueEntityRepository: Repository<VenueEntity>
  ) {}

  async findAll(
    conditions?: FindConditions<VenueEntity>
  ): Promise<VenueEntity[]> {
    if (conditions) {
      return this.venueEntityRepository.find(conditions);
    }
    return this.venueEntityRepository.find();
  }

  async findJoinZone(): Promise<VenueEntity[]> {
    return this.venueEntityRepository
      .createQueryBuilder("venue")
      .innerJoinAndSelect("venue.zone", "zone")
      .getMany();
  }

  async getById(id: string): Promise<VenueEntity> {
    return await this.venueEntityRepository
      .findOneOrFail(id)
      .catch(
        HttpExceptionsUtil.genericFindByUUIDErrorHandler(
          "Venue",
          id,
          this.logger
        )
      );
  }

  async getByIdJoinZone(id: string): Promise<VenueEntity> {
    return this.venueEntityRepository
      .createQueryBuilder("venue")
      .innerJoinAndSelect("venue.zone", "zone")
      .where("venue.id = :id", { id: id })
      .getOneOrFail()
      .catch(
        HttpExceptionsUtil.genericFindByUUIDErrorHandler(
          "Venue",
          id,
          this.logger
        )
      );
  }

  async create(createVenueDto: CreateVenueDto): Promise<VenueEntity> {
    return await this.venueEntityRepository.save(createVenueDto);
  }
}

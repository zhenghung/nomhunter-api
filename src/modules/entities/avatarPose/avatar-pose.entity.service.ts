import { Injectable, Logger } from "@nestjs/common";
import { GenericEntityService } from "../generic.entity.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AvatarPoseEntity } from "./avatar-pose.entity";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";

@Injectable()
export class AvatarPoseEntityService extends GenericEntityService<AvatarPoseEntity> {
  constructor(
    @InjectRepository(AvatarPoseEntity)
    private readonly avatarPoseEntityRepository: Repository<AvatarPoseEntity>
  ) {
    super(avatarPoseEntityRepository, new Logger(AvatarPoseEntityService.name), AvatarPoseEntity.name);
  }

  async findAll(): Promise<AvatarPoseEntity[]> {
    return this.avatarPoseEntityRepository
      .createQueryBuilder("avatarPose")
      .leftJoinAndSelect("avatarPose.poseSilhouette", "poseSilhouette")
      .leftJoinAndSelect("avatarPose.poseOutline", "poseOutline")
      .leftJoinAndSelect("avatarPose.poseHandSilhouette", "poseHandSilhouette")
      .leftJoinAndSelect("avatarPose.poseHandOutline", "poseHandOutline")
      .getMany();
  }

  async getById(id: string): Promise<AvatarPoseEntity> {
    return this.avatarPoseEntityRepository
      .createQueryBuilder("avatarPose")
      .leftJoinAndSelect("avatarPose.poseSilhouette", "poseSilhouette")
      .leftJoinAndSelect("avatarPose.poseOutline", "poseOutline")
      .leftJoinAndSelect("avatarPose.poseHandSilhouette", "poseHandSilhouette")
      .leftJoinAndSelect("avatarPose.poseHandOutline", "poseHandOutline")
      .where("avatarPose.id=:id", { id: id })
      .getOneOrFail()
      .catch(HttpExceptionsUtil.genericFindByUUIDErrorHandler(AvatarPoseEntity.name, id, this.logger));
  }

  async getDefaultPoseEntity(): Promise<AvatarPoseEntity> {
    return this.avatarPoseEntityRepository
      .createQueryBuilder("avatarPose")
      .leftJoinAndSelect("avatarPose.poseSilhouette", "poseSilhouette")
      .leftJoinAndSelect("avatarPose.poseOutline", "poseOutline")
      .leftJoinAndSelect("avatarPose.poseHandSilhouette", "poseHandSilhouette")
      .leftJoinAndSelect("avatarPose.poseHandOutline", "poseHandOutline")
      .orderBy("avatarPose.created_at", "ASC")
      .getOneOrFail();
  }
}

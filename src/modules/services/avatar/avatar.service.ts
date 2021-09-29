import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import Jimp from "jimp";
import { CreateAvatarDto } from "./dto/create-avatar.dto";
import { S3Service } from "../../clients/s3/s3.service";
import { FileEntityService } from "../../entities/file/file.entity.service";
import { PlayerEntityService } from "../../entities/player/player.entity.service";
import { CreateFileDto } from "../../entities/file/dto/create-file.dto";
import { FileEntity } from "../../entities/file/file.entity";
import { FileType } from "../../entities/file/file.type";
import { PlayerAvatarInterface } from "./interface/player-avatar.interface";
import { Colors } from "../../common/constants/colors";
import { AvatarPoseEntity } from "../../entities/avatarPose/avatar-pose.entity";
import { AvatarPoseEntityService } from "../../entities/avatarPose/avatar-pose.entity.service";
import { GearEntity } from "../../entities/gear/gear.entity";
import { GearEntityService } from "../../entities/gear/gear.entity.service";
import { PlayerAvatarEntityService } from "../../entities/playerAvatar/player-avatar.entity.service";
import { GearMappingEntityService } from "../../entities/gearMapping/gear-mapping.entity.service";
import { GearMappingEntity } from "../../entities/gearMapping/gear-mapping.entity";
import { PlayerEntity } from "../../entities/player/player.entity";
import { GearType } from "../../entities/gear/gear.type";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { ColorInterface } from "../../common/interface/color.interface";
import { createQueryBuilder } from "typeorm";

@Injectable()
export class AvatarService {
  private logger: Logger = new Logger(AvatarService.name);

  constructor(
    private readonly s3Service: S3Service,
    private readonly fileEntityService: FileEntityService,
    private readonly playerEntityService: PlayerEntityService,
    private readonly playerAvatarEntityService: PlayerAvatarEntityService,
    private readonly avatarPoseEntityService: AvatarPoseEntityService,
    private readonly gearEntityService: GearEntityService,
    private readonly gearMappingEntityService: GearMappingEntityService
  ) {}

  /**
   * Fetches the url of the profile pic image of the provided player id
   * @param playerId
   */
  async getPlayerAvatar(playerId: string): Promise<PlayerAvatarInterface> {
    const playerAvatar = await this.playerAvatarEntityService.getByPlayerId(playerId);
    return {
      poseId: playerAvatar.pose.id,
      faceId: playerAvatar.face.id,
      hatId: playerAvatar.hat == null ? null : playerAvatar.hat.id,
      weaponId: playerAvatar.weapon == null ? null : playerAvatar.weapon.id,
      color: playerAvatar.color,
      imageUrl: this.s3Service.getImageUrl("avatar", "profile", `${playerId}.png`),
    };
  }

  async getProfileGears(playerId: string): Promise<GearEntity[]> {
    return createQueryBuilder(GearEntity, "gear").select().innerJoinAndSelect("gear.file", "file").getMany();
  }

  async getProfilePoses(playerId: string): Promise<AvatarPoseEntity[]> {
    return createQueryBuilder(AvatarPoseEntity, "avatarPose").select().getMany();
  }

  /**
   * Loads playerAvatar wearables image file
   * Overlays and flattens them, then stores the result onto AWS S3
   * Rewrite the db of the player and file entities to point to the new url
   * @param createAvatarDto contains the selected wearables for the playerAvatar
   * @param playerId
   */
  async createAvatar(createAvatarDto: CreateAvatarDto, playerId: string): Promise<PlayerAvatarInterface> {
    const player: PlayerEntity = await this.playerEntityService.getById(playerId);
    this.logger.log(`Creating Avatar for player: ${playerId}`);

    const faceGear: GearEntity = await this.gearEntityService.getByIdAndType(createAvatarDto.faceId, GearType.FACE);
    const face: [GearEntity, Jimp] = [faceGear, await Jimp.read(faceGear.file.url)];
    const hatGear: GearEntity = await this.gearEntityService.getByIdAndType(createAvatarDto.hatId, GearType.HAT);
    const hat: [GearEntity, Jimp] = [hatGear, await Jimp.read(hatGear.file.url)];
    const weaponGear: GearEntity = await this.gearEntityService.getByIdAndType(
      createAvatarDto.weaponId,
      GearType.WEAPON
    );
    const weapon: [GearEntity, Jimp] = [weaponGear, await Jimp.read(weaponGear.file.url)];

    const pose: AvatarPoseEntity = await this.avatarPoseEntityService.getById(createAvatarDto.poseId);
    // Merge Image
    const mergedImage: Jimp = await this.mergeLayers(pose, face, hat, weapon, createAvatarDto.color);
    const imageBuffer: Buffer = await mergedImage.getBufferAsync(Jimp.MIME_PNG);

    // Upload merged Image to AWS S3
    const url = await this.s3Service.uploadFile(`avatar/profile/${playerId}.png`, imageBuffer, Jimp.MIME_PNG);
    await this.playerAvatarEntityService.updateByPlayer(
      player,
      pose,
      faceGear,
      hatGear,
      weaponGear,
      createAvatarDto.color
    );
    return {
      poseId: pose.id,
      faceId: faceGear.id,
      hatId: hatGear.id,
      weaponId: weaponGear.id,
      color: createAvatarDto.color,
      imageUrl: url,
    };
  }

  async createStockAvatar(player: PlayerEntity): Promise<void> {
    const faceGear: GearEntity = await this.gearEntityService.getDefaultFaceEntity();
    const face: [GearEntity, Jimp] = [faceGear, await Jimp.read(faceGear.file.url)];
    const pose: AvatarPoseEntity = await this.avatarPoseEntityService.getDefaultPoseEntity();
    const mergedImage: Jimp = await this.mergeLayers(pose, face, undefined, undefined, Colors.MANGO_SORBET_200_VALUE);
    const imageBuffer: Buffer = await mergedImage.getBufferAsync(Jimp.MIME_PNG);
    const url: string = await this.s3Service.uploadFile(`avatar/profile/${player.id}.png`, imageBuffer, Jimp.MIME_PNG);
    const fileEntity: FileEntity = await this.createImageFile(url, player.id);
    await this.playerAvatarEntityService.createStockAvatar(player, pose, faceGear, fileEntity);
  }

  private createImageFile(url: string, name: string): Promise<FileEntity> {
    const createFileDto: CreateFileDto = {
      type: FileType.AVATAR,
      name: name,
      url: url,
    };
    return this.fileEntityService.create(createFileDto);
  }

  private async mergeLayers(
    pose: AvatarPoseEntity,
    face: [GearEntity, Jimp],
    hat: [GearEntity, Jimp],
    weapon: [GearEntity, Jimp],
    color: string
  ): Promise<Jimp> {
    const poseSilhouetteJimp = await Jimp.read(pose.poseSilhouette.url);
    const poseOutlineJimp = await Jimp.read(pose.poseOutline.url);
    const poseHandSilhouetteJimp = await Jimp.read(pose.poseHandSilhouette.url);
    const poseHandOutlineJimp = await Jimp.read(pose.poseHandOutline.url);

    const newColor = Colors.COLOR_VALUE_MAP.get(color);
    if (!newColor) {
      throw HttpExceptionsUtil.createHttpException("Invalid color", HttpStatus.BAD_REQUEST, this.logger);
    }
    AvatarService.colorImage(poseSilhouetteJimp, newColor);
    AvatarService.colorImage(poseHandSilhouetteJimp, newColor);

    let mergedImage: Jimp;
    mergedImage = poseSilhouetteJimp.composite(poseOutlineJimp, 0, 0);
    mergedImage = await this.transformMergeImage(mergedImage, face, pose);
    if (hat) {
      mergedImage = await this.transformMergeImage(mergedImage, hat, pose);
    }
    if (weapon) {
      mergedImage = await this.transformMergeImage(mergedImage, weapon, pose);
    }
    mergedImage = mergedImage.composite(poseHandSilhouetteJimp, 0, 0);
    mergedImage = mergedImage.composite(poseHandOutlineJimp, 0, 0);
    return mergedImage;
  }

  private static colorImage(image: Jimp, color: ColorInterface): void {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
      if (image.bitmap.data[idx + 3] > 0) {
        image.bitmap.data[idx] = color.r;
        image.bitmap.data[idx + 1] = color.g;
        image.bitmap.data[idx + 2] = color.b;
        image.bitmap.data[idx + 3] = color.a;
      }
    });
  }

  private async transformMergeImage(
    baseImage: Jimp,
    gear: [GearEntity, Jimp],
    avatarPose: AvatarPoseEntity
  ): Promise<Jimp> {
    const gearMapping: GearMappingEntity = await this.gearMappingEntityService
      .findByAvatarIdAndGearId(avatarPose.id, gear[0].id)
      .then((gearMappingOptional) => {
        if (gearMappingOptional == undefined) {
          const defaultMapping = new GearMappingEntity();
          defaultMapping.transformX = 0;
          defaultMapping.transformY = 0;
          defaultMapping.transformRotation = 0;
          return defaultMapping;
        }
        return gearMappingOptional;
      });
    gear[1] = gear[1].rotate(gearMapping.transformRotation);
    return baseImage.composite(gear[1], gearMapping.transformX, gearMapping.transformY);
  }
}

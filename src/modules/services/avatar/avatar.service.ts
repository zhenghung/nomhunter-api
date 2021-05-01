import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import Jimp from "jimp";
import { CreateAvatarDto } from "./dto/create-avatar.dto";
import fs from "fs";
import { AvatarMappingDto } from "./dto/avatar-mapping.dto";
import { S3Service } from "../../clients/s3/s3.service";
import { FileEntityService } from "../../entities/file/file.entity.service";
import { PlayerEntityService } from "../../entities/player/player.entity.service";
import { CreateFileDto } from "../../entities/file/dto/create-file.dto";
import { FileEntity } from "../../entities/file/file.entity";
import { FileType } from "../../entities/file/file.type";
import { ProfilePicInterface } from "./interface/profile-pic.interface.";

@Injectable()
export class AvatarService {
  private logger: Logger = new Logger(AvatarService.name);

  constructor(
    private readonly s3Service: S3Service,
    private readonly fileEntityService: FileEntityService,
    private readonly playerEntityService: PlayerEntityService
  ) {}

  /**
   * Fetches the url of the profile pic image of the provided player id
   * @param playerId
   */
  async getAvatarImageUrl(playerId: string): Promise<ProfilePicInterface> {
    const player = await this.playerEntityService.getById(playerId);
    const imageId = player.profilePic;
    if (!imageId) {
      const url = this.s3Service.getImageUrl(
        "avatar",
        "profile",
        "default_profile.png"
      );
      return {
        name: "default",
        url: url,
      };
    }
    return await this.fileEntityService.getById(imageId).then((file) => {
      return {
        name: file.name,
        url: file.url,
      };
    });
  }

  /**
   * Loads avatar wearables image file
   * Overlays and flattens them, then stores the result onto AWS S3
   * Rewrite the db of the player and file entities to point to the new url
   * @param createAvatarDto contains the selected wearables for the avatar
   * @param playerId
   */
  async createAvatar(
    createAvatarDto: CreateAvatarDto,
    playerId: string
  ): Promise<ProfilePicInterface> {
    this.logger.log(`Creating Avatar for player: ${playerId}`);
    const avatarParts = this.getAvatarParts(createAvatarDto);

    // Merge Image
    const imageBuffer: Buffer = await Promise.all(avatarParts)
      .then(([bodyJimp, hatJimp, propJimp]) => {
        const mapping = AvatarService.getCustomisationMapping()[
          `avatar_body_${createAvatarDto.body}`
        ];
        const mergedImage = AvatarService.mergeImages(
          bodyJimp,
          hatJimp,
          propJimp,
          mapping
        );
        return mergedImage.getBufferAsync(Jimp.MIME_PNG);
      })
      .catch((error) => {
        this.logger.error("Something went wrong", error);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      });

    // Upload merged Image to AWS S3
    const url = await this.s3Service.uploadFile(
      `avatar/profile/${createAvatarDto.body}-${createAvatarDto.hat}-${createAvatarDto.prop}.png`,
      imageBuffer,
      Jimp.MIME_PNG
    );

    // Create FileEntity of Image
    const imageName = `${createAvatarDto.body}-${createAvatarDto.hat}-${createAvatarDto.prop}`;
    const fileCreated = await this.createImageFile(url, imageName);

    // Update Player entity with new profilePic image
    const profilePic = await this.playerEntityService
      .getById(playerId)
      .then((player) => player.profilePic);
    if (profilePic) {
      // Remove old profile pic from FileEntity Table since new one is created
      await this.fileEntityService.remove(profilePic);
    }
    if (
      await this.playerEntityService.updateProfilePic(playerId, fileCreated.id)
    ) {
      this.logger.log(`Avatar of player: ${playerId} created at url :${url}`);
      return { name: imageName, url: url };
    } else {
      this.logger.error("Failed to update player entity with profile pic");
      throw new HttpException(
        "Failed to update player entity with profile pic",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private getAvatarParts(createAvatarDto: CreateAvatarDto): Promise<Jimp>[] {
    const avatarBody: Promise<Jimp> = Jimp.read(
      this.s3Service.getImageUrl(
        "avatar",
        "body",
        `avatar_body_${createAvatarDto.body}.png`
      )
    );
    const avatarHat: Promise<Jimp> = Jimp.read(
      this.s3Service.getImageUrl(
        "avatar",
        "hat",
        `avatar_hat_${createAvatarDto.hat}.png`
      )
    );
    const avatarProp: Promise<Jimp> = Jimp.read(
      this.s3Service.getImageUrl(
        "avatar",
        "prop",
        `avatar_prop_${createAvatarDto.prop}.png`
      )
    );
    return [avatarBody, avatarHat, avatarProp];
  }

  private createImageFile(url: string, name: string): Promise<FileEntity> {
    const createFileDto: CreateFileDto = {
      type: FileType.PROFILE_PIC,
      name: name,
      url: url,
    };
    return this.fileEntityService.create(createFileDto);
  }

  private static mergeImages(body: Jimp, hat: Jimp, prop: Jimp, mapping): Jimp {
    let mergedImage: Jimp;
    if (mapping) {
      mergedImage = body.composite(hat, mapping.hat.x, mapping.hat.y);
      mergedImage = mergedImage.composite(prop, mapping.prop.x, mapping.prop.y);
    } else {
      mergedImage = body.composite(hat, 0, 0);
      mergedImage = mergedImage.composite(prop, 0, 0);
    }
    return mergedImage;
  }

  private static getCustomisationMapping(): { [k: string]: AvatarMappingDto } {
    return JSON.parse(
      fs.readFileSync("public/json/avatar_mapping.json", "utf-8")
    );
  }
}

import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import Jimp from "jimp";
import { CreateAvatarDto } from "./dto/create.avatar.dto";
import fs from "fs";
import { AvatarMappingDto } from "./dto/avatar.mapping.dto";

@Injectable()
export class AvatarService {
  private logger: Logger = new Logger(AvatarService.name);
  private static imageRootPath = "./public/images/avatar/";

  async createAvatar(
    createAvatarDto: CreateAvatarDto,
    userId: string
  ): Promise<string> {
    this.logger.log(`Creating Avatar for user: ${userId}`);

    const avatarBody: Promise<Jimp> = Jimp.read(
      `${AvatarService.imageRootPath}avatar_body_${createAvatarDto.body}.png`
    );
    const avatarHat: Promise<Jimp> = Jimp.read(
      `${AvatarService.imageRootPath}avatar_hat_${createAvatarDto.hat}.png`
    );
    const avatarProp: Promise<Jimp> = Jimp.read(
      `${AvatarService.imageRootPath}avatar_prop_${createAvatarDto.prop}.png`
    );

    await Promise.all([avatarBody, avatarHat, avatarProp])
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
        mergedImage.write(
          `${AvatarService.imageRootPath}merged/${createAvatarDto.body}-${createAvatarDto.hat}-${createAvatarDto.prop}.png`
        );
        this.logger.log(`Avatar of user: ${userId} created`);
      })
      .catch((error) => {
        this.logger.error("Something went wrong", error);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      });
    return "Success";
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

import { Controller, Get, Param, Req, Res, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { PhotosService } from "./photos.service";
import JwtAuthGuard from "../auth/guard/jwt-auth.guard";
import { RequestWithUser } from "../auth/interface/request-with-user.interface";

@ApiTags("Photos")
@Controller("photos")
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Fetch image from google maps api" })
  @ApiOkResponse({ description: "Image from google maps api" })
  @Get(":photoref")
  @UseGuards(JwtAuthGuard)
  async getAvatar(
    @Req() requestWithUser: RequestWithUser,
    @Param("photoref") photoRef: string,
    @Res() res
  ) {
    const b64Image = await this.photosService.getGoogleMapsPhotos(
      photoRef,
      100
    );
    return res.end(b64Image, "base64");
  }
}

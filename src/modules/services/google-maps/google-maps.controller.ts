import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { GoogleMapsService } from "./google-maps.service";
import JwtAuthGuard from "../auth/guard/jwt-auth.guard";
import { RequestWithUser } from "../auth/interface/request-with-user.interface";
import { DetailsResponseInterface } from "./interface/details-response.interface";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { OptionalIntPipe } from "../../common/pipes/optional-int.pipe";

@ApiTags("GoogleMapsProxy")
@Controller("google-maps")
export class GoogleMapsController {
  constructor(private readonly googleMapsService: GoogleMapsService) {}

  @ApiImplicitQuery({
    name: "width",
    required: false,
    type: Number,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: "Fetch image from google maps api" })
  @ApiOkResponse({ description: "Image from google maps api" })
  @Get("photo/:photo_ref")
  @UseGuards(JwtAuthGuard)
  async getGoogleMapPhoto(
    @Res() res,
    @Req() requestWithUser: RequestWithUser,
    @Param("photo_ref") photoRef: string,
    @Query("width", OptionalIntPipe) width?: number
  ): Promise<any> {
    const b64Image = await this.googleMapsService.getGoogleMapsPhotos(
      photoRef,
      width ? width : 100
    );
    return res.end(b64Image, "base64");
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Fetch details from google maps api" })
  @ApiOkResponse({ description: "Details from google maps api" })
  @Get("details/:place_id")
  @UseGuards(JwtAuthGuard)
  async getGoogleMapDetails(
    @Req() requestWithUser: RequestWithUser,
    @Param("place_id") placeId: string
  ): Promise<DetailsResponseInterface> {
    return await this.googleMapsService.getGooglePlacesDetails(placeId);
  }
}

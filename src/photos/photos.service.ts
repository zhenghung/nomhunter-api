import { HttpService, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PhotosService {
  private logger: Logger = new Logger(PhotosService.name);
  private readonly googleApiKey: string;
  private readonly googleMapsPhotosUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.googleApiKey = this.configService.get("google.apiKey");
    this.googleMapsPhotosUrl = this.configService.get("google.photoRootUrl");
  }

  /**
   * Fetch from google map api for the photos using the photo reference
   * @param photoReference photoReference used in google photos api
   * @param width dimension of photo
   */
  async getGoogleMapsPhotos(
    photoReference: string,
    width: number
  ): Promise<any> {
    this.logger.log(`Fetching google maps photos: ${photoReference}`);
    const photoUrl = `${this.googleMapsPhotosUrl}?maxwidth=${width}&photoreference=${photoReference}&key=${this.googleApiKey}`;
    return this.httpService
      .get(photoUrl, { responseType: "arraybuffer" })
      .toPromise()
      .then((response) =>
        Buffer.from(response.data, "binary").toString("base64")
      );
  }
}

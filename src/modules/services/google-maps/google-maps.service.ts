import { HttpService, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DetailsResponseInterface } from "./interface/details-response.interface";
import { map } from "rxjs/operators";

@Injectable()
export class GoogleMapsService {
  private logger: Logger = new Logger(GoogleMapsService.name);
  private readonly googleApiKey: string;
  private readonly googleMapsRootUrl: string;
  private readonly googleMapsPhotoPath: string;
  private readonly googleMapsDetailsPath: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.googleApiKey = this.configService.get("google.apiKey");
    this.googleMapsRootUrl = this.configService.get("google.mapsRootUrl");
    this.googleMapsPhotoPath = this.configService.get("google.photoPath");
    this.googleMapsDetailsPath = this.configService.get("google.detailsPath");
  }

  /**
   * Fetch from google map api for the google-maps using the photo reference
   * @param photoReference photoReference used in google google-maps api
   * @param width dimension of photo
   */
  async getGoogleMapsPhotos(
    photoReference: string,
    width: number
  ): Promise<string> {
    this.logger.log(`Fetching google maps photos: ${photoReference}`);
    const photoUrl = `${this.googleMapsRootUrl}${this.googleMapsPhotoPath}?maxwidth=${width}&photoreference=${photoReference}&key=${this.googleApiKey}`;
    return this.httpService
      .get(photoUrl, { responseType: "arraybuffer" })
      .pipe(map((axiosResponse) => axiosResponse.data))
      .toPromise()
      .then((data) => Buffer.from(data, "binary").toString("base64"));
  }

  /**
   * Fetches place details via Google Maps API
   * @param placeId as per google maps api
   */
  async getGooglePlacesDetails(
    placeId: string
  ): Promise<DetailsResponseInterface> {
    this.logger.log(`Fetching google maps details: ${placeId}`);
    const detailsUrl = `${this.googleMapsRootUrl}${this.googleMapsDetailsPath}?place_id=${placeId}&key=${this.googleApiKey}`;
    return this.httpService
      .get(detailsUrl, {
        responseType: "json",
      })
      .pipe(map((axiosResponse) => axiosResponse.data))
      .toPromise();
  }
}

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import S3 from "aws-sdk/clients/s3";

@Injectable()
export class S3Service {
  private logger: Logger = new Logger(S3Service.name);
  private readonly s3: S3;
  private readonly bucketName: string;
  private readonly s3RootUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>("aws.bucket");
    this.s3RootUrl = this.configService.get<string>("aws.s3RootUrl");
    this.s3 = new S3({
      region: this.configService.get<string>("aws.region"),
      accessKeyId: this.configService.get<string>("aws.accessKeyId"),
      secretAccessKey: this.configService.get<string>("aws.secretAccessKey"),
    });
  }

  /**
   * Upload file to S3 for the configured bucket
   * @param key path of the file inside the bucket
   * @param buffer file data
   * @param mimeType file type
   */
  async uploadFile(
    key: string,
    buffer: Buffer,
    mimeType: string
  ): Promise<string> {
    const params: S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ACL: "public-read",
    };

    this.logger.log(`Uploading to profiles folder in bucket ${params.Bucket}`);
    const uploadResult = await this.s3
      .upload(params, (err, data) => {
        if (err) {
          this.logger.error("Failed to upload image to S3", err.message);
          throw err;
        }
        this.logger.log(
          `Successfully uploaded image to S3 with url ${data.Location}`
        );
        return data;
      })
      .promise();
    return uploadResult.Location;
  }

  /**
   * Builds image url given the following parameters
   * @param feature highest level folder (e.g. avatar)
   * @param type sub level folder (e.g. profile)
   * @param name filename (e.g. 1-1-1.png)
   */
  getImageUrl(feature: string, type: string, name: string): string {
    return `${this.s3RootUrl}/${feature}/${type}/${name}`;
  }
}

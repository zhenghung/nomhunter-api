import { FileEntity } from "../../file/file.entity";

export class CreateBadgeDto {
  file: FileEntity;

  name: string;

  description: string;
}

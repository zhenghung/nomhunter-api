import { FileEntity } from "../../files/file.entity";

export class CreateBadgeDto {
  file: FileEntity;

  name: string;

  description: string;
}

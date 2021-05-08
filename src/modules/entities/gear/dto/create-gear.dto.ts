import { FileEntity } from "../../file/file.entity";

export class CreateGearDto {
  file: FileEntity;
  name: string;
  description: string;
}

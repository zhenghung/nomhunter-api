import { FileEntity } from "../../file/file.entity";
import { GearType } from "../gear.type";

export class CreateGearDto {
  file: FileEntity;
  name: string;
  description: string;
  type: GearType;
}

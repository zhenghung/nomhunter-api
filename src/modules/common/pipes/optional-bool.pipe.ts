import { PipeTransform } from "@nestjs/common";

export class OptionalBoolPipe implements PipeTransform {
  transform(value: string | undefined): boolean {
    return value ? value === "true" : false;
  }
}

import { PipeTransform } from "@nestjs/common";

export class OptionalBoolPipe implements PipeTransform {
  transform(value: string | undefined): boolean | undefined {
    return value ? value === "true" : undefined;
  }
}

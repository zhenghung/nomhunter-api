import { PipeTransform } from "@nestjs/common";

export class OptionalIntPipe implements PipeTransform {
  transform(value: string | undefined): number | undefined {
    return value ? parseInt(value) : undefined;
  }
}

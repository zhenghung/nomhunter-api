import { PipeTransform } from "@nestjs/common";

export class OptionalDatePipe implements PipeTransform {
  transform(value: string | undefined): Date | undefined {
    return value ? new Date(value) : undefined;
  }
}

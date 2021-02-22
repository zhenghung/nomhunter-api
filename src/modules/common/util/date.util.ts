import { addYears, subYears } from "date-fns";
import { Between } from "typeorm";

export class DateUtil {
  public static afterDate(date: Date) {
    return Between(date, addYears(date, 100));
  }

  public static beforeDate(date: Date) {
    return Between(subYears(date, 100), date);
  }
}

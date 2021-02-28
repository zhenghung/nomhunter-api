import { addYears, subYears } from "date-fns";
import { Between } from "typeorm";
import { FindOperator } from "typeorm/find-options/FindOperator";

export class DateUtil {
  public static afterDate(date: Date): FindOperator<Date> {
    return Between(date, addYears(date, 100));
  }

  public static beforeDate(date: Date): FindOperator<Date> {
    return Between(subYears(date, 100), date);
  }
}

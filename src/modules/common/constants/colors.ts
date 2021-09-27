import { ColorInterface } from "../interface/color.interface";

export class Colors {
  public static MANGO_SORBET_200_VALUE = "MANGO_SORBET_200";
  public static PUMPKIN_SOUP_200_VALUE = "PUMPKIN_SOUP_200";
  public static SMOKED_SALMON_200_VALUE = "SMOKED_SALMON_200";
  public static STRAWBERRY_SMOOTHIE_100_VALUE = "STRAWBERRY_SMOOTHIE_100";
  public static CASHEW_BUTTER_300_VALUE = "CASHEW_BUTTER_300";
  public static CASHEW_BUTTER_600_VALUE = "CASHEW_BUTTER_600";
  public static CASHEW_BUTTER_700_VALUE = "CASHEW_BUTTER_700";
  public static CASHEW_BUTTER_900_VALUE = "CASHEW_BUTTER_900";
  public static MANGO_SORBET_400_VALUE = "MANGO_SORBET_400";
  public static PUMPKIN_SOUP_400_VALUE = "PUMPKIN_SOUP_400";
  public static SMOKED_SALMON_400_VALUE = "SMOKED_SALMON_400";
  public static STRAWBERRY_SMOOTHIE_600_VALUE = "STRAWBERRY_SMOOTHIE_600";
  public static BLACKBERRY_PIE_700_VALUE = "BLACKBERRY_PIE_700";
  public static CABBAGE_SLAW_700_VALUE = "CABBAGE_SLAW_700";
  public static BLUEBERRY_MUFFIN_800_VALUE = "BLUEBERRY_MUFFIN_800";
  public static MINT_MILKSHAKE_400_VALUE = "MINT_MILKSHAKE_400";

  public static MANGO_SORBET_200: ColorInterface = Colors.hexToRgb("#FBEBBD");
  public static PUMPKIN_SOUP_200: ColorInterface = Colors.hexToRgb("#F8D3AD");
  public static SMOKED_SALMON_200: ColorInterface = Colors.hexToRgb("#F4CCBA");
  public static STRAWBERRY_SMOOTHIE_100: ColorInterface = Colors.hexToRgb("#F3D6D7");
  public static CASHEW_BUTTER_300: ColorInterface = Colors.hexToRgb("#E0D4B8");
  public static CASHEW_BUTTER_600: ColorInterface = Colors.hexToRgb("#C7AE89");
  public static CASHEW_BUTTER_700: ColorInterface = Colors.hexToRgb("#B99777");
  public static CASHEW_BUTTER_900: ColorInterface = Colors.hexToRgb("#977053");
  public static MANGO_SORBET_400: ColorInterface = Colors.hexToRgb("#F9D97D");
  public static PUMPKIN_SOUP_400: ColorInterface = Colors.hexToRgb("#FBB26A");
  public static SMOKED_SALMON_400: ColorInterface = Colors.hexToRgb("#F0A583");
  public static STRAWBERRY_SMOOTHIE_600: ColorInterface = Colors.hexToRgb("#D15D60");
  public static BLACKBERRY_PIE_700: ColorInterface = Colors.hexToRgb("#8C3B5E");
  public static CABBAGE_SLAW_700: ColorInterface = Colors.hexToRgb("#614379");
  public static BLUEBERRY_MUFFIN_800: ColorInterface = Colors.hexToRgb("#19427A");
  public static MINT_MILKSHAKE_400: ColorInterface = Colors.hexToRgb("#89D8A9");

  public static COLOR_VALUE_MAP: Map<string, ColorInterface> = new Map([
    [Colors.MANGO_SORBET_200_VALUE, Colors.MANGO_SORBET_200],
    [Colors.PUMPKIN_SOUP_200_VALUE, Colors.PUMPKIN_SOUP_200],
    [Colors.SMOKED_SALMON_200_VALUE, Colors.SMOKED_SALMON_200],
    [Colors.STRAWBERRY_SMOOTHIE_100_VALUE, Colors.STRAWBERRY_SMOOTHIE_100],
    [Colors.CASHEW_BUTTER_300_VALUE, Colors.CASHEW_BUTTER_300],
    [Colors.CASHEW_BUTTER_600_VALUE, Colors.CASHEW_BUTTER_600],
    [Colors.CASHEW_BUTTER_700_VALUE, Colors.CASHEW_BUTTER_700],
    [Colors.CASHEW_BUTTER_900_VALUE, Colors.CASHEW_BUTTER_900],
    [Colors.MANGO_SORBET_400_VALUE, Colors.MANGO_SORBET_400],
    [Colors.PUMPKIN_SOUP_400_VALUE, Colors.PUMPKIN_SOUP_400],
    [Colors.SMOKED_SALMON_400_VALUE, Colors.SMOKED_SALMON_400],
    [Colors.STRAWBERRY_SMOOTHIE_600_VALUE, Colors.STRAWBERRY_SMOOTHIE_600],
    [Colors.BLACKBERRY_PIE_700_VALUE, Colors.BLACKBERRY_PIE_700],
    [Colors.CABBAGE_SLAW_700_VALUE, Colors.CABBAGE_SLAW_700],
    [Colors.BLUEBERRY_MUFFIN_800_VALUE, Colors.BLUEBERRY_MUFFIN_800],
    [Colors.MINT_MILKSHAKE_400_VALUE, Colors.MINT_MILKSHAKE_400],
  ]);

  public static hexToRgb(hex: string): ColorInterface {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: 255,
    };
  }
}

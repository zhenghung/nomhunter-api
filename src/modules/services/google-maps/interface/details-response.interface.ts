import { DetailsResultInterface } from "./details-result.interface";

export interface DetailsResponseInterface {
  html_attributions: any[];
  result?: DetailsResultInterface;
  status: string;
}

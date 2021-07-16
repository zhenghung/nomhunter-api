import { MissionRewardInterface } from "./mission-reward.interface";

export interface MissionInterface {
  id: string;
  name: string;
  description: string;
  currentProgress: number;
  maxProgress: number;
  completed: boolean;
  claimed: boolean;
  level: number;
  rewards: MissionRewardInterface[];
}

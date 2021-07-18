import { MissionInterface } from "./mission.interface";

export interface MissionGroupInterface {
  missionGroupId: string;
  name: string;
  flagged: boolean;
  missions: MissionInterface[];
}

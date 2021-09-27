import { MissionGroupEntity } from "../../entities/missionGroup/mission-group.entity";
import { MissionGroupsInterface } from "./interface/mission-groups.interface";
import { MissionGroupInterface } from "./interface/mission-group.interface";
import { MissionInterface } from "./interface/mission.interface";
import { MissionRewardInterface } from "./interface/mission-reward.interface";

export class MissionTransformer {
  static map(missionGroupEntities: MissionGroupEntity[]): MissionGroupsInterface {
    const missionGroupsMapped: MissionGroupInterface[] = missionGroupEntities.map((missionGroupEntity) => {
      const missionsMapped: MissionInterface[] = missionGroupEntity.missions.map((missionEntity) => {
        const rewardsMapped: MissionRewardInterface[] = [];
        if (missionEntity.rewardCoin > 0) {
          rewardsMapped.push({
            type: "reward.coin",
            rewardImageUrl:
              "https://lh3.googleusercontent.com/proxy/1onjJRuJNPtYT6Qw1kwhrKLCgCzbnv77nwOO-vDnds01ynepHfaC3hDA7uy4F6YnQ5taA-0WPQSevxbop03eeJyG1l9Ya4EHNJ2WjXQYPVu1-RRk03GgLakz3bkk",
          });
        }
        if (missionEntity.rewardExp > 0) {
          rewardsMapped.push({
            type: "reward.exp",
            rewardImageUrl: "https://static.odealo.com/uploads/auction_images//13497874885e839ed4a3b4f.png",
          });
        }
        if (missionEntity.rewardGear) {
          rewardsMapped.push({
            type: "reward.gear",
            rewardImageUrl:
              "https://mpng.subpng.com/20190420/wck/kisspng-vector-graphics-computer-icons-royalty-free-gear-i-gears-work-setting-support-svg-png-icon-free-downl-5cbab9bec3a703.9705184315557411188014.jpg",
          });
        }
        const missionMapped: MissionInterface = {
          id: missionEntity.id,
          name: missionEntity.name,
          description: missionEntity.description,
          currentProgress:
            missionEntity.playerMissions.length > 0 ? missionEntity.playerMissions[0].currentProgress : 0,
          maxProgress: missionEntity.maxProgress,
          completed: missionEntity.playerMissions.length > 0 ? missionEntity.playerMissions[0].completed : false,
          claimed: missionEntity.playerMissions.length > 0 ? missionEntity.playerMissions[0].claimed : false,
          level: missionEntity.level,
          rewards: rewardsMapped,
        };
        return missionMapped;
      });
      const missionGroupMapped: MissionGroupInterface = {
        missionGroupId: missionGroupEntity.id,
        name: missionGroupEntity.name,
        flagged: missionGroupEntity.missionGroupFlags.length > 0,
        missions: missionsMapped,
      };
      return missionGroupMapped;
    });
    return {
      missionGroups: missionGroupsMapped,
    };
  }
}

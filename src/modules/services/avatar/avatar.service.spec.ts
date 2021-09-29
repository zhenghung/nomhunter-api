import { Test, TestingModule } from "@nestjs/testing";
import { S3Service } from "../../clients/s3/s3.service";
import { FileEntityService } from "../../entities/file/file.entity.service";
import { PlayerEntityService } from "../../entities/player/player.entity.service";
import { AvatarService } from "./avatar.service";
import { PlayerEntity } from "../../entities/player/player.entity";
import { CreateAvatarDto } from "./dto/create-avatar.dto";
import { PlayerAvatarInterface } from "./interface/player-avatar.interface";
import { FileEntity } from "../../entities/file/file.entity";
import { FileType } from "../../entities/file/file.type";
import { Colors } from "../../common/constants/colors";
import { PlayerAvatarEntityService } from "../../entities/playerAvatar/player-avatar.entity.service";
import { AvatarPoseEntityService } from "../../entities/avatarPose/avatar-pose.entity.service";
import { GearEntityService } from "../../entities/gear/gear.entity.service";
import { GearMappingEntityService } from "../../entities/gearMapping/gear-mapping.entity.service";
import { AvatarPoseEntity } from "../../entities/avatarPose/avatar-pose.entity";
import { GearEntity } from "../../entities/gear/gear.entity";
import { GearMappingEntity } from "../../entities/gearMapping/gear-mapping.entity";

const testCreateAvatarDto = new CreateAvatarDto();
testCreateAvatarDto.poseId = "poseId";
testCreateAvatarDto.hatId = "hatId";
testCreateAvatarDto.weaponId = "weaponId";
testCreateAvatarDto.faceId = "faceId";
testCreateAvatarDto.color = Colors.MANGO_SORBET_200_VALUE;

const testPlayer1 = new PlayerEntity();
testPlayer1.id = "someId";
testPlayer1.email = "newPlayer@nomhunter.com";
testPlayer1.password = "password";
testPlayer1.nickname = "NewPlayer";

const testFile = new FileEntity();
testFile.id = "imageId";
testFile.type = FileType.AVATAR;
testFile.name = "1-1-1";
testFile.url = "https://someurl.com/";

const testUrl = "https://someurl.com/";

const testAvatarPose = new AvatarPoseEntity();
testAvatarPose.poseSilhouette = testFile;
testAvatarPose.poseOutline = testFile;
testAvatarPose.poseHandOutline = testFile;
testAvatarPose.poseHandSilhouette = testFile;

const testGear = new GearEntity();
testGear.file = testFile;

const testGearMapping = new GearMappingEntity();

const testProfilePic: PlayerAvatarInterface = {
  poseId: "string",
  faceId: "string",
  hatId: "string",
  weaponId: "string",
  color: Colors.MANGO_SORBET_200_VALUE,
  imageUrl: testUrl,
};

describe("AvatarService", () => {
  let service: AvatarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvatarService,
        {
          provide: PlayerEntityService,
          useValue: {
            getById: jest.fn().mockResolvedValue(testPlayer1),
            updateProfilePic: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: FileEntityService,
          useValue: {
            create: jest.fn().mockResolvedValue(testFile),
            getById: jest.fn().mockResolvedValue(testFile),
            remove: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: S3Service,
          useValue: {
            uploadFile: jest.fn().mockReturnValue(testUrl),
            getImageUrl: jest.fn().mockReturnValue(testUrl),
          },
        },
        {
          provide: PlayerAvatarEntityService,
          useValue: {
            updateByPlayer: jest.fn().mockResolvedValue({}),
            createStockAvatar: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: AvatarPoseEntityService,
          useValue: {
            getById: jest.fn().mockResolvedValue(testAvatarPose),
            getDefaultPose: jest.fn().mockResolvedValue(testAvatarPose),
          },
        },
        {
          provide: GearEntityService,
          useValue: {
            getByIdAndType: jest.fn().mockResolvedValue(testGear),
            getDefaultFaceEntity: jest.fn().mockResolvedValue(testGear),
          },
        },
        {
          provide: GearMappingEntityService,
          useValue: {
            findByAvatarIdAndGearId: jest.fn().mockResolvedValue(testGearMapping),
          },
        },
      ],
    }).compile();

    service = module.get<AvatarService>(AvatarService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAvatarImageUrl", () => {
    it("should return playerAvatar image url of the player", () => {
      return expect(service.getPlayerAvatar(testPlayer1.id)).resolves.toEqual(testProfilePic);
    });
  });

  describe("createAvatar", () => {
    it("should return the player entity created", () => {
      return expect(service.createAvatar(testCreateAvatarDto, testPlayer1.id)).resolves.toEqual(testProfilePic);
    });
  });
});

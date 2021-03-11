import { Test, TestingModule } from "@nestjs/testing";
import { S3Service } from "../../clients/s3/s3.service";
import { FileEntityService } from "../../entities/file/file.entity.service";
import { PlayerEntityService } from "../../entities/player/player.entity.service";
import { AvatarService } from "./avatar.service";
import { PlayerEntity } from "../../entities/player/player.entity";
import { CreateAvatarDto } from "./dto/create-avatar.dto";
import { ProfilePicInterface } from "./interface/profile-pic.interface.";
import { FileEntity, FileType } from "../../entities/file/file.entity";

const testCreateAvatarDto = new CreateAvatarDto();
testCreateAvatarDto.body = 1;
testCreateAvatarDto.hat = 1;
testCreateAvatarDto.prop = 1;

const testPlayer1 = new PlayerEntity();
testPlayer1.id = "someId";
testPlayer1.email = "newPlayer@nomhunter.com";
testPlayer1.password = "password";
testPlayer1.firstName = "NewPlayer";
testPlayer1.lastName = "NewLastName";
testPlayer1.profilePic = "imageId";

const testFile = new FileEntity();
testFile.id = "imageId";
testFile.type = FileType.PROFILE_PIC;
testFile.name = "1-1-1";
testFile.url = "https://someurl.com/";

const testUrl = "https://someurl.com/";

const testProfilePic: ProfilePicInterface = {
  name: "1-1-1",
  url: testUrl,
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
            getImageUrl: jest
              .fn()
              .mockReturnValue("./public/images/blank_image.png"),
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
    it("should return avatar image url of the player", () => {
      return expect(service.getAvatarImageUrl(testPlayer1.id)).resolves.toEqual(
        testProfilePic
      );
    });
  });

  describe("createAvatar", () => {
    it("should return the player entity created", () => {
      return expect(
        service.createAvatar(testCreateAvatarDto, testPlayer1.id)
      ).resolves.toEqual(testProfilePic);
    });
  });
});

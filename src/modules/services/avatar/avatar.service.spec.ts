import { Test, TestingModule } from "@nestjs/testing";
import { S3Service } from "../../clients/s3/s3.service";
import { FilesService } from "../../entities/files/files.service";
import { UsersService } from "../../entities/users/users.service";
import { AvatarService } from "./avatar.service";
import { UserEntity } from "../../entities/users/user.entity";
import { CreateAvatarDto } from "./dto/create-avatar.dto";
import { ProfilePicInterface } from "./interface/profile-pic.interface.";
import { FileEntity, FileType } from "../../entities/files/file.entity";

const testCreateAvatarDto = new CreateAvatarDto();
testCreateAvatarDto.body = 1;
testCreateAvatarDto.hat = 1;
testCreateAvatarDto.prop = 1;

const testUser1 = new UserEntity();
testUser1.id = "someId";
testUser1.email = "newUser@nomhunter.com";
testUser1.password = "password";
testUser1.firstName = "NewUser";
testUser1.lastName = "NewLastName";
testUser1.profilePic = "imageId";

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
          provide: UsersService,
          useValue: {
            getById: jest.fn().mockResolvedValue(testUser1),
            updateProfilePic: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: FilesService,
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
    it("should return avatar image url of the user", () => {
      return expect(service.getAvatarImageUrl(testUser1.id)).resolves.toEqual(
        testProfilePic
      );
    });
  });

  describe("createAvatar", () => {
    it("should return the user entity created", () => {
      return expect(
        service.createAvatar(testCreateAvatarDto, testUser1.id)
      ).resolves.toEqual(testProfilePic);
    });
  });
});

import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./user.entity";
import { QueryFailedError } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

const testUser1 = new UserEntity();
testUser1.id = "1";
testUser1.email = "userOne@nomhunter.com";
testUser1.password = "password1";
testUser1.firstName = "UserOne";
testUser1.lastName = "NameOne";
testUser1.profilePic = "default_profile";
testUser1.createdAt = new Date();
testUser1.updatedAt = new Date();

const testUser2 = new UserEntity();
testUser2.id = "2";
testUser2.email = "userTwo@nomhunter.com";
testUser2.password = "password2";
testUser2.firstName = "UserTwo";
testUser2.lastName = "NameTwo";
testUser2.profilePic = "default_profile";
testUser2.createdAt = new Date();
testUser2.updatedAt = new Date();

const newUserDTO: CreateUserDto = {
  email: "newUser@nomhunter.com",
  password: "password3",
  firstName: "NewUser",
  lastName: "NewLastName",
};

describe("User Controller", () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([testUser1, testUser2]),
            getById: jest.fn().mockResolvedValue(testUser1),
            getByEmail: jest.fn().mockResolvedValue(testUser1),
            create: jest.fn().mockResolvedValue(testUser1),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a new user", () => {
      return expect(controller.create(newUserDTO)).resolves.toEqual(testUser1);
    });
    it("email already exist", () => {
      jest
        .spyOn(usersService, "create")
        .mockRejectedValue(
          new QueryFailedError(
            "",
            [],
            'duplicate key value violates unique constraint "UQ_e12875dfb3b1d92d7d7c5377e22"'
          )
        );
      return controller.create(newUserDTO).catch((error) => {
        expect(error).toStrictEqual(
          new HttpException(
            `User with email ${newUserDTO.email} already taken`,
            HttpStatus.BAD_REQUEST
          )
        );
      });
    });
  });

  describe("findAll", () => {
    it("should get an array of users", () => {
      return expect(controller.findAll()).resolves.toEqual([
        testUser1,
        testUser2,
      ]);
    });
  });

  describe("findOne", () => {
    it("should get a single user", () => {
      return expect(controller.findOne("a uuid")).resolves.toEqual(testUser1);
    });
  });

  describe("remove", () => {
    it("successfully called if entity deleted", () => {
      const removeSpy = jest
        .spyOn(usersService, "remove")
        .mockResolvedValue(true);
      const testResult = expect(
        controller.remove("a uuid that exists")
      ).resolves.not.toThrow();
      expect(removeSpy).toBeCalledWith("a uuid that exists");
      return testResult;
    });
  });
});

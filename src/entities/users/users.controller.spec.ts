import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";
import { QueryFailedError } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

const testUser1: User = {
  id: "1",
  email: "userOne@nomhunter.com",
  password: "password1",
  firstName: "UserOne",
  lastName: "NameOne",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const testUser2: User = {
  id: "2",
  email: "userTwo@nomhunter.com",
  password: "password2",
  firstName: "UserTwo",
  lastName: "NameTwo",
  createdAt: new Date(),
  updatedAt: new Date(),
};

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

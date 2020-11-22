import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DeleteResult, QueryFailedError, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";

const testUser1 = new User();
testUser1.email = "test1@nomhunter.com";
testUser1.password = "password1";
testUser1.firstName = "John";
testUser1.lastName = "Doe";

const testUser2 = new User();
testUser2.email = "test2@nomhunter.com";
testUser2.password = "password2";
testUser2.firstName = "Tsz Hey";
testUser2.lastName = "Lam";

const usersArray = [testUser1, testUser2];

const createTestUser = new CreateUserDto();
createTestUser.email = testUser2.email;
createTestUser.password = testUser2.password;
createTestUser.firstName = testUser2.firstName;
createTestUser.lastName = testUser2.lastName;

describe("UsersService", () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(usersArray),
            findOneOrFail: jest.fn().mockResolvedValue(testUser1),
            save: jest.fn().mockReturnValue(testUser2),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const users = await service.findAll();
      return expect(users).toEqual(usersArray);
    });
  });

  describe("getById", () => {
    it("should get a single user", () => {
      const repoSpy = jest.spyOn(repo, "findOneOrFail");
      const testResult = expect(service.getById("a uuid")).resolves.toEqual(
        testUser1
      );
      expect(repoSpy).toBeCalledWith("a uuid");
      return testResult;
    });
    it("cannot find user", () => {
      const repoSpy = jest
        .spyOn(repo, "findOneOrFail")
        .mockRejectedValue(new EntityNotFoundError("User", "bad uuid"));
      const testPromise = service.getById("bad uuid").catch((error) => {
        expect(error).toStrictEqual(
          new HttpException(
            "User of id: bad uuid does not exist",
            HttpStatus.NOT_FOUND
          )
        );
      });
      expect(repoSpy).toBeCalledWith("bad uuid");
      return testPromise;
    });
    it("not a uuid", () => {
      const repoSpy = jest
        .spyOn(repo, "findOneOrFail")
        .mockRejectedValue(
          new QueryFailedError(
            "",
            [],
            'invalid input syntax for type uuid: "not a uuid"'
          )
        );
      const testPromise = service.getById("not a uuid").catch((error) => {
        expect(error).toStrictEqual(
          new HttpException("not a uuid is not a UUID", HttpStatus.BAD_REQUEST)
        );
      });
      expect(repoSpy).toBeCalledWith("not a uuid");
      return testPromise;
    });
  });

  describe("getByEmail", () => {
    it("should get a single user", () => {
      const repoSpy = jest.spyOn(repo, "findOneOrFail");
      const testPromise = expect(
        service.getByEmail("an email string")
      ).resolves.toEqual(testUser1);
      expect(repoSpy).toBeCalledWith({ email: "an email string" });
      return testPromise;
    });
    it("cannot find user with email", () => {
      const repoSpy = jest
        .spyOn(repo, "findOneOrFail")
        .mockRejectedValue(new EntityNotFoundError("User", "bad email"));
      const testPromise = service.getByEmail("bad email").catch((error) => {
        expect(error).toStrictEqual(
          new HttpException(
            "User of email: bad email does not exist",
            HttpStatus.NOT_FOUND
          )
        );
      });
      expect(repoSpy).toBeCalledWith({ email: "bad email" });
      return testPromise;
    });
  });

  describe("create", () => {
    it("should successfully create a user", () => {
      const repoSpy = jest.spyOn(repo, "save");
      const testResult = expect(
        service.create(createTestUser)
      ).resolves.toEqual(testUser2);
      expect(repoSpy).toBeCalledTimes(1);
      expect(repoSpy).toBeCalledWith(testUser2);
      return testResult;
    });
  });

  describe("remove", () => {
    it("should return deleted", () => {
      const successDeleteResult = new DeleteResult();
      successDeleteResult.raw = [];
      successDeleteResult.affected = 1;
      const repoSpy = jest
        .spyOn(repo, "delete")
        .mockResolvedValue(successDeleteResult);
      const testResult = expect(service.remove("a uuid")).resolves.toEqual(
        true
      );
      expect(repoSpy).toBeCalledWith("a uuid");
      expect(repoSpy).toBeCalledTimes(1);
      return testResult;
    });
    it("should throw NotFound HttpException", () => {
      const failedDeleteResult = new DeleteResult();
      failedDeleteResult.raw = [];
      failedDeleteResult.affected = 0;
      const repoSpy = jest
        .spyOn(repo, "delete")
        .mockResolvedValue(failedDeleteResult);
      const testResult = expect(
        service.remove("a bad uuid")
      ).rejects.toThrowError(
        new HttpException(
          "User of id: a bad uuid does not exist",
          HttpStatus.NOT_FOUND
        )
      );
      expect(repoSpy).toBeCalledWith("a bad uuid");
      expect(repoSpy).toBeCalledTimes(1);
      return testResult;
    });
    it("Error deleting user entity", () => {
      const repoSpy = jest.spyOn(repo, "delete").mockRejectedValue(new Error());
      const testResult = expect(
        service.remove("a bad uuid")
      ).rejects.toThrowError(
        new HttpException(
          "Something went wrong",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
      expect(repoSpy).toBeCalledWith("a bad uuid");
      expect(repoSpy).toBeCalledTimes(1);
      return testResult;
    });
  });
});

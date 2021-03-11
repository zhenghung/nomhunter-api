import { Test, TestingModule } from "@nestjs/testing";
import { PlayerEntityService } from "./player.entity.service";
import { PlayerEntity } from "./player.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { QueryFailedError, Repository, UpdateResult } from "typeorm";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";

const testPlayer1 = new PlayerEntity();
testPlayer1.email = "test1@nomhunter.com";
testPlayer1.password = "password1";
testPlayer1.firstName = "John";
testPlayer1.lastName = "Doe";

const testPlayer2 = new PlayerEntity();
testPlayer2.email = "test2@nomhunter.com";
testPlayer2.password = "password2";
testPlayer2.firstName = "Tsz Hey";
testPlayer2.lastName = "Lam";

const playersArray = [testPlayer1, testPlayer2];

const createTestPlayer = new CreatePlayerDto();
createTestPlayer.email = testPlayer2.email;
createTestPlayer.password = testPlayer2.password;
createTestPlayer.firstName = testPlayer2.firstName;
createTestPlayer.lastName = testPlayer2.lastName;

describe("PlayersService", () => {
  let service: PlayerEntityService;
  let repo: Repository<PlayerEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerEntityService,
        {
          provide: getRepositoryToken(PlayerEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(playersArray),
            findOneOrFail: jest.fn().mockResolvedValue(testPlayer1),
            save: jest.fn().mockReturnValue(testPlayer2),
            delete: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlayerEntityService>(PlayerEntityService);
    repo = module.get<Repository<PlayerEntity>>(
      getRepositoryToken(PlayerEntity)
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of player", async () => {
      const players = await service.findAll();
      return expect(players).toEqual(playersArray);
    });
  });

  describe("getById", () => {
    it("should get a single player", () => {
      const repoSpy = jest.spyOn(repo, "findOneOrFail");
      const testResult = expect(service.getById("a uuid")).resolves.toEqual(
        testPlayer1
      );
      expect(repoSpy).toBeCalledWith("a uuid");
      return testResult;
    });
    it("cannot find player", () => {
      const repoSpy = jest
        .spyOn(repo, "findOneOrFail")
        .mockRejectedValue(new EntityNotFoundError("Player", "bad uuid"));
      const testPromise = service.getById("bad uuid").catch((error) => {
        expect(error).toStrictEqual(
          new HttpException(
            "Player of id: bad uuid does not exist",
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
    it("should get a single player", () => {
      const repoSpy = jest.spyOn(repo, "findOneOrFail");
      const testPromise = expect(
        service.getByEmail("an email string")
      ).resolves.toEqual(testPlayer1);
      expect(repoSpy).toBeCalledWith({ email: "an email string" });
      return testPromise;
    });
    it("cannot find player with email", () => {
      const repoSpy = jest
        .spyOn(repo, "findOneOrFail")
        .mockRejectedValue(new EntityNotFoundError("Player", "bad email"));
      const testPromise = service.getByEmail("bad email").catch((error) => {
        expect(error).toStrictEqual(
          new HttpException(
            "Player of email: bad email does not exist",
            HttpStatus.NOT_FOUND
          )
        );
      });
      expect(repoSpy).toBeCalledWith({ email: "bad email" });
      return testPromise;
    });
  });

  describe("create", () => {
    it("should successfully create a player", () => {
      const repoSpy = jest.spyOn(repo, "save");
      const testResult = expect(
        service.create(createTestPlayer)
      ).resolves.toEqual(testPlayer2);
      expect(repoSpy).toBeCalledTimes(1);
      expect(repoSpy).toBeCalledWith(testPlayer2);
      return testResult;
    });
  });

  describe("updateProfilePic", () => {
    it("should return true", () => {
      const successUpdateResult = new UpdateResult();
      successUpdateResult.affected = 1;
      const repoSpy = jest
        .spyOn(repo, "update")
        .mockResolvedValue(successUpdateResult);
      const testResult = expect(
        service.updateProfilePic("a uuid", "imageId")
      ).resolves.toEqual(true);
      expect(repoSpy).toBeCalledWith(
        { id: "a uuid" },
        { profilePic: "imageId" }
      );
      expect(repoSpy).toBeCalledTimes(1);
      return testResult;
    });
    it("should return false", () => {
      const successUpdateResult = new UpdateResult();
      successUpdateResult.affected = 0;
      const repoSpy = jest
        .spyOn(repo, "update")
        .mockResolvedValue(successUpdateResult);
      const testResult = expect(
        service.updateProfilePic("a uuid", "imageId")
      ).resolves.toEqual(false);
      expect(repoSpy).toBeCalledWith(
        { id: "a uuid" },
        { profilePic: "imageId" }
      );
      expect(repoSpy).toBeCalledTimes(1);
      return testResult;
    });
  });
});

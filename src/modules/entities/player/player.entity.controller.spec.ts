import { Test, TestingModule } from "@nestjs/testing";
import { PlayerEntityController } from "./player.entity.controller";
import { PlayerEntityService } from "./player.entity.service";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { PlayerEntity } from "./player.entity";
import { QueryFailedError } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

const testPlayer1 = new PlayerEntity();
testPlayer1.id = "1";
testPlayer1.email = "playerOne@nomhunter.com";
testPlayer1.password = "password1";
testPlayer1.nickname = "PlayerOne";
testPlayer1.createdAt = new Date();
testPlayer1.updatedAt = new Date();

const testPlayer2 = new PlayerEntity();
testPlayer2.id = "2";
testPlayer2.email = "playerTwo@nomhunter.com";
testPlayer2.password = "password2";
testPlayer2.nickname = "PlayerTwo";
testPlayer2.createdAt = new Date();
testPlayer2.updatedAt = new Date();

const newPlayerDTO: CreatePlayerDto = {
  email: "newPlayer@nomhunter.com",
  password: "password3",
  nickname: "NewPlayer",
};

describe("PlayerEntityController", () => {
  let controller: PlayerEntityController;
  let playersService: PlayerEntityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerEntityController],
      providers: [
        {
          provide: PlayerEntityService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([testPlayer1, testPlayer2]),
            getById: jest.fn().mockResolvedValue(testPlayer1),
            getByEmail: jest.fn().mockResolvedValue(testPlayer1),
            create: jest.fn().mockResolvedValue(testPlayer1),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlayerEntityController>(PlayerEntityController);
    playersService = module.get<PlayerEntityService>(PlayerEntityService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a new player", () => {
      return expect(controller.create(newPlayerDTO)).resolves.toEqual(testPlayer1);
    });
    it("email already exist", () => {
      jest
        .spyOn(playersService, "create")
        .mockRejectedValue(
          new QueryFailedError(
            "",
            [],
            'duplicate key value violates unique constraint "UQ_e12875dfb3b1d92d7d7c5377e22"'
          )
        );
      return controller.create(newPlayerDTO).catch((error) => {
        expect(error).toStrictEqual(
          new HttpException(`Player with email ${newPlayerDTO.email} already taken`, HttpStatus.BAD_REQUEST)
        );
      });
    });
  });

  describe("findAll", () => {
    it("should get an array of player", () => {
      return expect(controller.findAll()).resolves.toEqual([testPlayer1, testPlayer2]);
    });
  });

  describe("findOne", () => {
    it("should get a single player", () => {
      return expect(controller.findOne("a uuid")).resolves.toEqual(testPlayer1);
    });
  });
});

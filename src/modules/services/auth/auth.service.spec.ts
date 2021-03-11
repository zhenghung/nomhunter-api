import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { PlayerEntityService } from "../../entities/player/player.entity.service";
import { JwtService } from "@nestjs/jwt";
import { PlayerEntity } from "../../entities/player/player.entity";
import { RegisterDto } from "./dto/register.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { QueryFailedError } from "typeorm";
import { LoginDto } from "./dto/login.dto";
import { HttpExceptions } from "../../common/constants/http.exceptions";

const loginDto: LoginDto = {
  email: "newPlayer@nomhunter.com",
  password: "password1",
};

const registerDto: RegisterDto = {
  ...loginDto,
  firstName: "NewPlayer",
  lastName: "NewLastName",
};

const testPlayer1 = new PlayerEntity();
testPlayer1.email = "newPlayer@nomhunter.com";
testPlayer1.password =
  "$2b$10$R1SOiUOVNjGLu2nfuX3JX.O6sArbzmL55C90/3mGwQRgl/yqMsUo2";
testPlayer1.firstName = "NewPlayer";
testPlayer1.lastName = "NewLastName";

const jwtSignedPayload = {
  bearerToken: "876432145678967634211354YU",
};

describe("AuthService", () => {
  let service: AuthService;
  let playersService: PlayerEntityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PlayerEntityService,
          useValue: {
            create: jest.fn().mockResolvedValue(testPlayer1),
            getByEmail: jest.fn().mockResolvedValue(testPlayer1),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(jwtSignedPayload.bearerToken),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    playersService = module.get<PlayerEntityService>(PlayerEntityService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("register", () => {
    it("should return the player entity created", () => {
      return expect(service.register(registerDto)).resolves.toEqual(
        testPlayer1
      );
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
      return service.register(registerDto).catch((error) => {
        expect(error).toStrictEqual(
          new HttpException(
            "Player with that email already exists",
            HttpStatus.BAD_REQUEST
          )
        );
      });
    });
    it("Something else went wrong (e.g. database connection refused)", () => {
      jest.spyOn(playersService, "create").mockRejectedValue(new Error());
      return service.register(registerDto).catch((error) => {
        expect(error).toStrictEqual(
          new HttpException(
            "Something went wrong",
            HttpStatus.INTERNAL_SERVER_ERROR
          )
        );
      });
    });
  });

  describe("login", () => {
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
      return expect(service.login(testPlayer1)).toStrictEqual(jwtSignedPayload);
    });
  });

  describe("validatePlayer", () => {
    it("correct credentials", () => {
      jest.spyOn(playersService, "getByEmail").mockResolvedValue(testPlayer1);
      return expect(
        service.validatePlayer(loginDto.email, loginDto.password)
      ).resolves.toStrictEqual(testPlayer1);
    });
    it("email not found", () => {
      jest
        .spyOn(playersService, "getByEmail")
        .mockRejectedValue(
          new HttpException(
            `Player of email: ${loginDto.email} does not exist`,
            HttpStatus.NOT_FOUND
          )
        );
      return service
        .validatePlayer(loginDto.email, loginDto.password)
        .catch((error) => {
          expect(error).toStrictEqual(HttpExceptions.INCORRECT_CREDENTIALS);
        });
    });
    it("wrong password", () => {
      jest.spyOn(playersService, "getByEmail").mockResolvedValue(testPlayer1);
      return service
        .validatePlayer(loginDto.email, "incorrectPassword")
        .catch((error) => {
          expect(error).toStrictEqual(HttpExceptions.INCORRECT_CREDENTIALS);
        });
    });
  });
});

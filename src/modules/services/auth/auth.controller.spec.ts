import { AuthService } from "./auth.service";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { PlayerEntity } from "../../entities/player/player.entity";
import { RequestWithPlayer } from "./interface/request-with-player.interface";
import { LoginReq } from "./req/login.req";
import { RegisterReq } from "./req/register.req";

const testPlayer1 = new PlayerEntity();
testPlayer1.email = "newPlayer@nomhunter.com";
testPlayer1.password = "password1";
testPlayer1.nickname = "NewPlayer";

const jwtSignedPayload = {
  bearerToken: "876432145678967634211354YU",
};

const loginDto: LoginReq = {
  email: "newPlayer@nomhunter.com",
  password: "password1",
};

const registerDto: RegisterReq = {
  ...loginDto,
  nickname: "NewPlayer",
};

const requestWithPlayer = {
  user: testPlayer1,
} as RequestWithPlayer;

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue(testPlayer1),
            login: jest.fn().mockReturnValue(jwtSignedPayload),
            validatePlayer: jest.fn().mockResolvedValue(testPlayer1),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });

  describe("register", () => {
    it("email already exist", () => {
      return expect(controller.register(registerDto)).resolves.toStrictEqual(testPlayer1);
    });
  });

  describe("login", () => {
    it("email already exist", () => {
      return expect(controller.login(requestWithPlayer, loginDto)).toStrictEqual(jwtSignedPayload);
    });
  });

  describe("getProfile", () => {
    it("email already exist", () => {
      return expect(controller.getProfile(requestWithPlayer)).toStrictEqual(testPlayer1);
    });
  });
});

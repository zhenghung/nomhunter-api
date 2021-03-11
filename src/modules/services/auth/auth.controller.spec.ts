import { AuthService } from "./auth.service";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { UserEntity } from "../../entities/user/user.entity";
import { RequestWithUser } from "./interface/request-with-user.interface";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

const testUser1 = new UserEntity();
testUser1.email = "newUser@nomhunter.com";
testUser1.password = "password1";
testUser1.firstName = "NewUser";
testUser1.lastName = "NewLastName";

const jwtSignedPayload = {
  bearerToken: "876432145678967634211354YU",
};

const loginDto: LoginDto = {
  email: "newUser@nomhunter.com",
  password: "password1",
};

const registerDto: RegisterDto = {
  ...loginDto,
  firstName: "NewUser",
  lastName: "NewLastName",
};

const requestWithUser = {
  user: testUser1,
} as RequestWithUser;

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
            register: jest.fn().mockResolvedValue(testUser1),
            login: jest.fn().mockReturnValue(jwtSignedPayload),
            validateUser: jest.fn().mockResolvedValue(testUser1),
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
      return expect(controller.register(registerDto)).resolves.toStrictEqual(
        testUser1
      );
    });
  });

  describe("login", () => {
    it("email already exist", () => {
      return expect(controller.login(requestWithUser, loginDto)).toStrictEqual(
        jwtSignedPayload
      );
    });
  });

  describe("getProfile", () => {
    it("email already exist", () => {
      return expect(controller.getProfile(requestWithUser)).toStrictEqual(
        testUser1
      );
    });
  });
});

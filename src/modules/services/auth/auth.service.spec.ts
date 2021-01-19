import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../../entities/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "../../entities/users/user.entity";
import { RegisterDto } from "./dto/register.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { QueryFailedError } from "typeorm";
import { LoginDto } from "./dto/login.dto";
import { HttpExceptions } from "../../common/constants/http.exceptions";

const loginDto: LoginDto = {
  email: "newUser@nomhunter.com",
  password: "password1",
};

const registerDto: RegisterDto = {
  ...loginDto,
  firstName: "NewUser",
  lastName: "NewLastName",
};

const testUser1 = new UserEntity();
testUser1.email = "newUser@nomhunter.com";
testUser1.password =
  "$2b$10$R1SOiUOVNjGLu2nfuX3JX.O6sArbzmL55C90/3mGwQRgl/yqMsUo2";
testUser1.firstName = "NewUser";
testUser1.lastName = "NewLastName";

const jwtSignedPayload = {
  bearerToken: "876432145678967634211354YU",
};

describe("AuthService", () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(testUser1),
            getByEmail: jest.fn().mockResolvedValue(testUser1),
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
    usersService = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("register", () => {
    it("should return the user entity created", () => {
      return expect(service.register(registerDto)).resolves.toEqual(testUser1);
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
      return service.register(registerDto).catch((error) => {
        expect(error).toStrictEqual(
          new HttpException(
            "User with that email already exists",
            HttpStatus.BAD_REQUEST
          )
        );
      });
    });
    it("Something else went wrong (e.g. database connection refused)", () => {
      jest.spyOn(usersService, "create").mockRejectedValue(new Error());
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
        .spyOn(usersService, "create")
        .mockRejectedValue(
          new QueryFailedError(
            "",
            [],
            'duplicate key value violates unique constraint "UQ_e12875dfb3b1d92d7d7c5377e22"'
          )
        );
      return expect(service.login(testUser1)).toStrictEqual(jwtSignedPayload);
    });
  });

  describe("validateUser", () => {
    it("correct credentials", () => {
      jest.spyOn(usersService, "getByEmail").mockResolvedValue(testUser1);
      return expect(
        service.validateUser(loginDto.email, loginDto.password)
      ).resolves.toStrictEqual(testUser1);
    });
    it("email not found", () => {
      jest
        .spyOn(usersService, "getByEmail")
        .mockRejectedValue(
          new HttpException(
            `User of email: ${loginDto.email} does not exist`,
            HttpStatus.NOT_FOUND
          )
        );
      return service
        .validateUser(loginDto.email, loginDto.password)
        .catch((error) => {
          expect(error).toStrictEqual(HttpExceptions.INCORRECT_CREDENTIALS);
        });
    });
    it("wrong password", () => {
      jest.spyOn(usersService, "getByEmail").mockResolvedValue(testUser1);
      return service
        .validateUser(loginDto.email, "incorrectPassword")
        .catch((error) => {
          expect(error).toStrictEqual(HttpExceptions.INCORRECT_CREDENTIALS);
        });
    });
  });
});

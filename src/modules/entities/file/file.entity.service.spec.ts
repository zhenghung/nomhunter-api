import { Test, TestingModule } from "@nestjs/testing";
import { FileEntity, FileType } from "./file.entity";
import { DeleteResult, Repository } from "typeorm";
import { FileEntityService } from "./file.entity.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import { HttpException, HttpStatus } from "@nestjs/common";
import { CreateFileDto } from "./dto/create-file.dto";

const testFile = new FileEntity();
testFile.name = "1-1-1";
testFile.type = FileType.PROFILE_PIC;
testFile.url = "https://somelinktourl.com/";

const testCreateFile = new CreateFileDto();
testCreateFile.name = "1-1-1";
testCreateFile.type = FileType.PROFILE_PIC;
testCreateFile.url = "https://somelinktourl.com/";

describe("FilesService", () => {
  let service: FileEntityService;
  let repo: Repository<FileEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileEntityService,
        {
          provide: getRepositoryToken(FileEntity),
          useValue: {
            findOneOrFail: jest.fn().mockResolvedValue(testFile),
            save: jest.fn().mockReturnValue(testFile),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FileEntityService>(FileEntityService);
    repo = module.get<Repository<FileEntity>>(getRepositoryToken(FileEntity));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getById", () => {
    it("should get a single file", () => {
      const repoSpy = jest.spyOn(repo, "findOneOrFail");
      const testResult = expect(service.getById("a uuid")).resolves.toEqual(
        testFile
      );
      expect(repoSpy).toBeCalledWith("a uuid");
      return testResult;
    });
    it("cannot find file", () => {
      const repoSpy = jest
        .spyOn(repo, "findOneOrFail")
        .mockRejectedValue(new EntityNotFoundError("FileEntity", "bad uuid"));
      const testPromise = service.getById("bad uuid").catch((error) => {
        expect(error).toStrictEqual(
          new HttpException(
            "FileEntity of id: bad uuid does not exist",
            HttpStatus.NOT_FOUND
          )
        );
      });
      expect(repoSpy).toBeCalledWith("bad uuid");
      return testPromise;
    });
  });

  describe("create", () => {
    it("should successfully create a player", () => {
      const repoSpy = jest.spyOn(repo, "save");
      const testResult = expect(
        service.create(testCreateFile)
      ).resolves.toEqual(testFile);
      expect(repoSpy).toBeCalledTimes(1);
      expect(repoSpy).toBeCalledWith(testFile);
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
          "FileEntity of id: a bad uuid does not exist",
          HttpStatus.NOT_FOUND
        )
      );
      expect(repoSpy).toBeCalledWith("a bad uuid");
      expect(repoSpy).toBeCalledTimes(1);
      return testResult;
    });
    it("Error deleting File entity", () => {
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

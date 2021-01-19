import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FilesService } from "./files.service";
import { FileEntity } from "./file.entity";
import { CreateFileDto } from "./dto/create-file.dto";

@ApiTags("Files")
@Controller("files")
export class FilesController {
  private readonly logger = new Logger(FilesController.name);

  constructor(private readonly filesService: FilesService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto): Promise<FileEntity> {
    this.logger.log(`Creating file with url: ${createFileDto.url}`);
    return this.filesService.create(createFileDto).then((file: FileEntity) => {
      this.logger.log(`File with id ${file.id} successfully created`);
      return file;
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<FileEntity> {
    this.logger.log(`Fetching file with id ${id}`);
    return this.filesService.getById(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<void> {
    this.logger.log(`Deleting file with id ${id}`);
    return this.filesService
      .remove(id)
      .then(() => this.logger.log(`File with id ${id} successfully deleted`));
  }
}

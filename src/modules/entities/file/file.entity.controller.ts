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
import { FileEntityService } from "./file.entity.service";
import { FileEntity } from "./file.entity";
import { CreateFileDto } from "./dto/create-file.dto";

@ApiTags("FileEntity")
@Controller("entities/file")
export class FileEntityController {
  private readonly logger = new Logger(FileEntityController.name);

  constructor(private readonly fileEntityService: FileEntityService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto): Promise<FileEntity> {
    this.logger.log(`Creating file with url: ${createFileDto.url}`);
    return this.fileEntityService
      .create(createFileDto)
      .then((file: FileEntity) => {
        this.logger.log(`File with id ${file.id} successfully created`);
        return file;
      });
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<FileEntity> {
    this.logger.log(`Fetching file with id ${id}`);
    return this.fileEntityService.getById(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<void> {
    this.logger.log(`Deleting file with id ${id}`);
    return this.fileEntityService
      .remove(id)
      .then(() => this.logger.log(`File with id ${id} successfully deleted`));
  }
}

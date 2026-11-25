import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { PlaceholderService } from './placeholder.service';
import { Placeholder } from '../placeholders/entities/placeholder.entity';
import { CreatePlaceholderDto } from './create_placeholder.dto';

@Controller('placeholders') // Base route: /placeholders
export class PlaceholderController {
  constructor(private readonly placeholderService: PlaceholderService) {}

  // GET /placeholders
  // Returns all placeholders
  @Get()
  async findAll(): Promise<Placeholder[]> {
    return this.placeholderService.findAll();
  }

  // POST /placeholders
  // Creates a new placeholder
  @Post()
  async create(
    @Body() createPlaceholderDto: CreatePlaceholderDto,
  ): Promise<Placeholder> {
    return this.placeholderService.create(createPlaceholderDto);
  }

  // DELETE /placeholders/:id
  // Deletes a placeholder by ID
  @Delete(':id')
  async remove(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => new BadRequestException('Invalid ID format'),
      }),
    )
    id: number,
  ) {
    return this.placeholderService.remove(+id);
  }
}

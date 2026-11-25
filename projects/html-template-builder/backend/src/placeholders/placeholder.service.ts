import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Placeholder } from './entities/placeholder.entity';
import { CreatePlaceholderDto } from './create_placeholder.dto';

@Injectable()
export class PlaceholderService {
  constructor(
    @InjectRepository(Placeholder)
    private readonly placeholderRepository: Repository<Placeholder>, // Injects the Placeholder repository for DB access
  ) {}

  // Fetches all placeholders from the database
  async findAll(): Promise<Placeholder[]> {
    return this.placeholderRepository.find();
  }

  // Creates a new placeholder and saves it to the database
  async create(createPlaceholderDto: CreatePlaceholderDto): Promise<Placeholder> {
    const placeholder = this.placeholderRepository.create(createPlaceholderDto);
    return await this.placeholderRepository.save(placeholder);
  }

  // Deletes a placeholder by ID
  async remove(id: number): Promise<void> {
    await this.placeholderRepository.delete(id);
  }
}

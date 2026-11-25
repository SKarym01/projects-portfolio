import { InjectRepository } from "@nestjs/typeorm";
import { UpdateEmailTemplateDto } from "./dto/update-email_template.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { EmailTemplate } from "./entities/email_template.entity";
import { Repository } from "typeorm";
import { CreateEmailTemplateDto } from "./dto/create-email_template.dto";

@Injectable()
export class EmailTemplateService {
  constructor(
    @InjectRepository(EmailTemplate)
    private emailTemplateRepository: Repository<EmailTemplate> // Inject the repository for database operations
  ) {}

  // Create a new email template and save it to the database
  async create(createDto: CreateEmailTemplateDto) {
    const template = this.emailTemplateRepository.create({
      ...createDto,
      lastModified: new Date(), // Set current date as last modified
    });
    return await this.emailTemplateRepository.save(template);
  }

  // Return all email templates including soft-deleted ones, ordered by lastModified descending
  async findAll() {
    return await this.emailTemplateRepository.find({
      withDeleted: true, // Include soft-deleted templates
      order: { lastModified: 'DESC' },
    });
  }

  // Find a single template by its ID
  async findOne(id: number): Promise<EmailTemplate> {
    const template = await this.emailTemplateRepository.findOne({ 
      where: { templateId: id } 
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    return template;
  }

  // Soft delete by ID (not used in your controller but here for flexibility)
  async softDelete(id: string): Promise<void> {
    await this.emailTemplateRepository.softDelete(id);
  }

  // Update an existing template by ID
  async update(id: number, updateDto: UpdateEmailTemplateDto) { 
    const template = await this.findOne(id); // Ensure the template exists

    await this.emailTemplateRepository.update(
      { templateId: id }, 
      {
        ...updateDto,
        lastModified: new Date(), // Update lastModified timestamp
      }
    );

    return this.findOne(id); // Return updated template
  }

  // Mark the template as "outdated" and perform soft delete
  async remove(id: number): Promise<EmailTemplate> {
    await this.emailTemplateRepository.update({ templateId: id }, {
      status: 'outdated', // Update status before deletion
      lastModified: new Date(),
    });

    await this.emailTemplateRepository.softDelete({ templateId: id });

    return await this.emailTemplateRepository.findOne({
      where: { templateId: id },
      withDeleted: true, // Include soft-deleted template in result
    });
  }
}

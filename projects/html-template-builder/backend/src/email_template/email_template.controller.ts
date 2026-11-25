import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { EmailTemplateService } from './email_template.service';
import { CreateEmailTemplateDto } from './dto/create-email_template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email_template.dto';
import { Roles } from 'nest-keycloak-connect';

@Controller('email-template')
export class EmailTemplateController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  // Endpoint: POST /email-template/newTemp
  // Creates a new email template
  @Post('newTemp')
  async create(@Body() createEmailTemplateDto: CreateEmailTemplateDto) {
    console.log('Received data:', createEmailTemplateDto);
    return this.emailTemplateService.create(createEmailTemplateDto);
  }

  // Endpoint: GET /email-template/allTemplates
  // Returns all email templates
  @Get('allTemplates')
  findAll() {
    return this.emailTemplateService.findAll();
  }

  // Endpoint: GET /email-template/:id
  // Returns a single template by ID
  @Get(':id')
  async getTemplateById(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => new BadRequestException('Invalid ID format'),
      }),
    )
    id: number,
  ) {
    return this.emailTemplateService.findOne(id);
  }

  // Endpoint: PATCH /email-template/:id
  // Updates a template by ID (restricted to certain roles)
  @Patch(':id')
  @Roles({ roles: ['realm:geschäftsstelle', 'realm:admin'] }) // Role-based access control
  async update(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => new BadRequestException('Invalid ID format'),
      }),
    )
    id: number,
    @Body() updateDto: UpdateEmailTemplateDto,
  ) {
    try {
      return await this.emailTemplateService.update(id, updateDto);
    } catch (error) {
      console.error('Error updating template:', error);
      throw new NotFoundException(error.message);
    }
  }

  // Endpoint: DELETE /email-template/:id
  // Soft-deletes a template by ID
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
    return this.emailTemplateService.remove(id);
  }
}

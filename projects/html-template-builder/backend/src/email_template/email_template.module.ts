import { Module } from '@nestjs/common';
import { EmailTemplateService } from './email_template.service';
import { EmailTemplateController } from './email_template.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplate } from './entities/email_template.entity';

@Module({
  // Registers the controller that handles HTTP requests for email templates
  controllers: [EmailTemplateController],

  // Registers the service that contains business logic for email templates
  providers: [EmailTemplateService],

  // Registers the EmailTemplate entity with TypeORM for database access
  imports: [TypeOrmModule.forFeature([EmailTemplate])],
})
export class EmailTemplateModule {}

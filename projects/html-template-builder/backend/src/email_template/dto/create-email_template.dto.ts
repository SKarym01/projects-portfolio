export class CreateEmailTemplateDto {
  templateTitle: string;
  description: string;
  emailFrom: string;
  emailTo: string;
  subject: string;
  content: string;
  status: 'draft' | 'released' | 'outdated';
}

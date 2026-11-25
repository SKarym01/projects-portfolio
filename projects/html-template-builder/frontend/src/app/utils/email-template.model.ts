export interface EmailTemplate {
  // Optional unique identifier for the template
  templateId?: number;

  // Title of the email template
  templateTitle: string;

  // Description of the template purpose or use case
  description: string;

  // Sender email address
  emailFrom: string;

  // Recipient email address (can be dynamic with placeholders)
  emailTo: string;

  // Subject line of the email
  subject: string;

  // HTML or text content of the email
  content: string;

  // Current status of the template
  status: 'draft' | 'released' | 'outdated';

  // Timestamp for the last modification (optional)
  lastModified?: Date;

  // Optional field to mark when the template was soft-deleted
  deletedAt?: Date | null;
}

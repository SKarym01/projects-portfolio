import { BaseEntity, Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailTemplate extends BaseEntity {
  // Primary key: automatically generated ID for the template
  @PrimaryGeneratedColumn(({ name: 'template_id' }))
  templateId: number;

  // Title of the email template
  @Column()
  templateTitle: string;

  // Description of the email template
  @Column()
  description: string;

  // Sender email address
  @Column()
  emailFrom: string;

  // Recipient email address
  @Column()
  emailTo: string;

  // Subject line of the email
  @Column()
  subject: string;

  // Email content (HTML or text)
  @Column('text')
  content: string;

  // Template status: draft, released or outdated
  @Column({ 
    type: 'enum', 
    enum: ['draft', 'released', 'outdated'],
    default: 'draft'
  })
  status: string;

  // Last modified date (defaults to current date)
  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  lastModified: Date;

  // Soft delete timestamp (set when the template is marked as deleted)
  @DeleteDateColumn()
  deletedAt?: Date;
}

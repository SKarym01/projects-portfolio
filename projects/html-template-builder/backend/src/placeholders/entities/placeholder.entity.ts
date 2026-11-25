import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('placeholders') // Binds this class to the 'placeholders' table
export class Placeholder {
  // Unique UUID as primary key
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  // Unique key used as the identifier for the placeholder (e.g. {{firstName}})
  @Column({ unique: true })
  key: string; 

  // Human-readable description of what this placeholder represents
  @Column()
  description: string; 

  // Optional category to group placeholders (e.g. "PIs", "Links")
  @Column({ nullable: true })
  category: string;

  // Controls the display order within a category (default is 0)
  @Column({ default: 0 })
  display_order: number;
}

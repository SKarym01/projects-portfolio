# HTML Template Builder Backend

## Description

HTML Template Builder Backend is a robust NestJS application designed to manage email templates and placeholders. This system provides a flexible and efficient way to create, store, and manage email templates with dynamic content placeholders.

## Features

- Email Template Management: Create, read, update, and delete email templates
- Placeholder Management: Manage reusable placeholders for dynamic content
- Database Integration: Utilizes TypeORM for efficient database operations
- Soft Delete: Implements soft delete functionality for email templates

## Tech Stack

- NestJS: A progressive Node.js framework for building efficient and scalable server-side applications
- TypeORM: ORM for TypeScript and JavaScript
- PostgreSQL: Open-source relational database

## Project Structure

The project is organized into modules:

- `email_template`: Manages email templates
- `placeholders`: Handles placeholder entities

## Key Entities

### Email Template

- `templateId`: Unique identifier for the template
- `templateTitle`: Title of the email template
- `description`: Description of the template
- `emailFrom`: Sender's email address
- `emailTo`: Recipient's email address
- `subject`: Email subject
- `content`: Main content of the email (HTML/Text)
- `status`: Current status of the template (draft/released/outdated)
- `lastModified`: Date of last modification
- `deletedAt`: Soft delete timestamp

### Placeholder

- `id`: Unique identifier for the placeholder
- `key`: Unique key for the placeholder
- `description`: Description of the placeholder
- `category`: Category of the placeholder (optional)
- `display_order`: Order for display purposes

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd html-template-builder-backend
2. Install dependencies:
npm install
3. Set up your environment variables:
Create a .env file in the root directory with the following variables:
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=your_database_name

Running the Application

Development mode:
npm run start:dev

Production mode:
npm run build
npm run start:prod

Database Migrations

Run migrations:
npm run migration:run

Generate a new migration:
npm run migration:generate -- src/migrations/MigrationName

API Endpoints
/email-template: CRUD operations for email templates
/placeholders: CRUD operations for placeholders

For detailed API documentation, please refer to the API documentation (if available) or the controller files in the source code.

Testing
Run tests:
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov

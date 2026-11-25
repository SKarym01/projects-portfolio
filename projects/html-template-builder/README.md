# Email Template Builder

This full-stack web application was the focus of my bachelor's thesis. It supports creating, editing and managing HTML email templates with reusable placeholders and draft/release workflows.

## Architecture

- **Frontend:** Angular and TypeScript, with a rich-text editor and Keycloak authentication
- **Backend:** NestJS REST API with TypeORM and PostgreSQL
- **Main resources:** Email templates and reusable placeholders

The source is organized into [`frontend/`](frontend/) and [`backend/`](backend/). Each has its own `package.json`.

## Configuration

The original deployment configuration is not included. Before running the application, configure the frontend's Keycloak settings and studies link in `frontend/src/app/environments/environment.ts`. Configure the backend's PostgreSQL and Keycloak settings through environment variables; see the backend module for the required variable names.

No credentials or database contents are included. The submitted source has not been independently built or tested outside its original environment.

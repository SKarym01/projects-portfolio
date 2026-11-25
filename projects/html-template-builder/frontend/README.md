# HTML Template Builder Frontend

This project is an Angular-based frontend application for building HTML email templates.

## Project Overview

This application allows users to create, edit, and manage email templates. It includes features such as a rich text editor, placeholder management, and template saving functionality.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   Apply
   git clone [your-repository-url]

2. Navigate to the project directory:
   cd html-template-builder-frontend

3. Install dependencies:
   npm install

### Running the Application

1. Start the JSON server (for mock backend):
   npm run json-server

2. In a separate terminal, start the Angular development server:
   npm start

3. Open your browser and navigate to `http://localhost:4200`

## Features

- Rich text editor for creating email templates
- Placeholder management and insertion
- Template saving and editing functionality
- Draft and release modes for templates

## Project Structure

- `src/app/components/views`: Contains top-level components
- `src/app/components/elements`: Reusable UI components
- `src/app/services`: Application services
- `src/app/utils`: Utility functions and models

## Development

### Code Styling

This project uses ESLint and Prettier for code formatting and linting. To ensure your code meets the project standards:

- Run linting: `npm run lint:check`
- Fix linting issues: `npm run lint:fix`
- Check formatting: `npm run format:check`
- Fix formatting issues: `npm run format:fix`

### Pre-commit Hooks

This project uses Husky for pre-commit hooks to ensure code quality. The hooks will run linting and formatting checks before allowing a commit.

## Building for Production

To build the application for production, run:
npm run build

The build artifacts will be stored in the `dist/` directory.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.


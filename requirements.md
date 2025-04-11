# Project Overview

Build a streamlined interface for managing AI model fine-tuning jobs with a focus on creating new jobs and viewing existing ones.

_IMPORTANT_
We value your time and have designed this exercise to take no more than 3 - 4 hours. Focus on implementing the core requirements first, then add polish if time permits.
Please feel free to use the provided designs however you like, we do not expect you to copy one for one

# Technical Requirements

## Required technologies (must use)

- Next.js: Implement the application using Next.js framework
- TypeScript: Ensure type safety with proper TypeScript implementation

## Features to Demonstrate (priority order)

Fine-Tuning Job Creation Form:

- Create a form for setting up new fine-tuning jobs
- Include fields for:
  - Job name (with validation for 3-50 chars, alphanumeric and dashes)
  - Base model selection (from available options)
  - Number of training epochs
  - Evaluation epochs (with validation against total epochs)
  - Warm-up epochs (with validation against total epochs)
  - Learning rate (between 0 and 1)
  - Implement state management for the form process

API Integration:

- Connect to the fine-tuning API endpoints: - GET /api/jobs - List all jobs with summary statistics - POST /api/jobs - Create a new job - GET /api/models - List available models for selection in form
  Optional: - DELETE functionality for jobs

Job Listing Dashboard:

- Display a list of all fine-tuning jobs
- Show key job details including status (Running, Completed, Failed)
- Display summary statistics (total completed, running, and failed jobs)
- Optional: Implement job deletion functionality

## API Information

- Base URL: https://fe-test-api-production.up.railway.app/api/
- API Documentation: https://fe-test-api-production.up.railway.app/api/openapi.json
- Authentication: Use the provided x-api-key for all requests
  Tip: You can view and explore the OpenAPI schema in a more user-friendly format by pasting the schema JSON into https://editor-next.swagger.io/

## Key Skills to Demonstrate

- State Management: For form with interdependent field validations
- API Integration: Proper handling of asynchronous operations
- Form Validation: Ensuring data integrity according to the API requirements
- Response Handling: Managing loading, error, and success states
- Component Design: Creating reusable and maintainable UI components
- Styling: Implementing a clean, professional interface

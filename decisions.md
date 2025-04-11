# Frontend Technical Decisions Document

## Overview

This document outlines the key technical decisions for our frontend implementation, focusing on state management, form handling, validation, and UI components.

## Core Technology Choices

### 1. State Management: React Query

**Selected: TanStack Query (React Query)**

**Alternatives Considered:**

- Redux/RTK Query
- SWR
- Zustand
- Jotai

**Decision Rationale:**

- Built-in cache management and invalidation
- Automatic background refetching
- Server state synchronization
- Built-in devtools
- TypeScript support
- Minimal boilerplate compared to Redux
- Handles loading/error states elegantly

**Trade-offs:**

- Learning curve for advanced features
- Might be overkill for simple CRUD apps
- Need to carefully manage cache invalidation

### 2. Schema Validation: Zod

**Selected: Zod**

**Alternatives Considered:**

- Yup
- Joi
- io-ts
- TypeBox

**Decision Rationale:**

- First-class TypeScript support
- Runtime type checking
- Excellent error messages
- Great ecosystem integration (React Query, Conform)
- More type-safe than Yup
- Better DX than io-ts
- Active maintenance and community

**Trade-offs:**

- Slightly larger bundle size than Yup
- Less mature than Joi
- Steeper learning curve than simpler validators

### 3. Form Management: Conform

**Selected: Conform**

**Alternatives Considered:**

- React Hook Form
- Formik
- Final Form

**Decision Rationale:**

- Progressive enhancement by default
- Server-first approach aligns with Next.js
- Native Zod integration
- Works without JavaScript
- Better accessibility
- Smaller bundle size
- Great TypeScript support

**Trade-offs:**

- Newer library with smaller community
- Different mental model from client-side form libraries
- Fewer examples and resources available
- Less third-party component integration

### 4. UI Components: Shadcn/UI

**Selected: Shadcn/UI**

**Alternatives Considered:**

- MUI (Material-UI)
- Chakra UI
- Mantine
- Tailwind UI
- RadixUI

**Decision Rationale:**

- Copy-paste approach (not a dependency)
- Built on RadixUI primitives for accessibility
- High customization with Tailwind
- Modern design aesthetic
- Perfect Next.js integration
- Small bundle size (only include what you use)
- Active maintenance and updates

**Trade-offs:**

- Need to manage component code in project
- Requires Tailwind CSS setup
- More setup time initially
- Need to update components manually

## Future Considerations

1. **Performance Monitoring**

- Consider implementing React Query's built-in devtools
- Monitor bundle size impact
- Track form submission performance

2. **Accessibility**

- Leverage Shadcn/UI's built-in accessibility features
- Regular accessibility audits
- Ensure progressive enhancement works as expected

3. **Maintenance**

- Keep track of Shadcn/UI component updates
- Monitor React Query cache invalidation patterns
- Review form validation rules regularly

4. **Team Onboarding**

- Document common patterns
- Create component usage guidelines
- Establish form validation standards

# TODO

- How would I have implemented _pixel perfect_ translation between figma and code?
- What are the different Next.js rendering modes? SSR, SSG?
- Be able to explain the different hydration situations and why the react query setup was necessary
- Why do we need to put providers in a file called providers.tsx?
- Assumption: evaluation epochs and warmup epochs are between 0 and the total number of training epochs
- Assumption: training epochs must be atleast 1

## Check list

- State Management: For form with interdependent field validations
- API Integration: Proper handling of asynchronous operations
- Form Validation: Ensuring data integrity according to the API requirements
- Response Handling: Managing loading, error, and success states
- Component Design: Creating reusable and maintainable UI components
  - Should I create more consistent sizing for layout, wrapper classes which standardize text size, etc?
  - Update the root layout so that it uses page layout
- Styling: Implementing a clean, professional interface

## Getting Started

Add the environment variable API_KEY={your_api_key} inside of an .env file or via Environment Variables on Vercel.

Then run

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Or deploy via vercel

## Decisons

### State Management

I chose `react-hook-form` for form state management and `zod` to enable me to declare and manage the interdependent field validations of our create new job form. Another form state management library I considered was Conform, which enables progressive enhancement of forms by providing native HTML validation attributes for a good client-side validation experience even before/without JavaScript. I ultimately chose react-hook-form because it offered a more maintainable API for validating sections of the form using `const isValid = await form.trigger(fields)`. This allowed me to write maintainable logic for validating only the set of fields displayed on each step of the create new job form.

I selected `zod` for several key reasons:

1. It's TypeScript-first, providing type safety after parsing input values.
2. It allowed me to easily define the interdependent nature of our training, evaluation, and warm-up epochs.
3. It enables the same validation logic to be used on both client and server, creating a smooth user experience while preventing issues that could arise if users attempt to call our API directly

### API Integration

- In this project, I utilized server components and server functions to provide simple state management for our client as well as improved Time to First Byte (TTFB) compared to client side data fetching.

- For the `JobsChart`, I implemented polling to update job statuses in real-time. This allows users to see the most recent status of their jobs without needing to refresh the page. I used `react-query` to manage caching and refetching of data fetched from the client side. By leveraging `react-query`'s newer features, I prefetched jobs data on the server and included that data in a serialized react query client. This ensures that jobs data is immediately available before JavaScript is loaded. Once JavaScript is loaded, the client doesn't need to refetch jobs data because it already exists in the client-side cache.

- For models data on the creat-new-job form I choose to fetch data on the server side and then pass down a promise to the child components (BaseModeSelect and BaseModelReview) that needed them. This allowed me to immeditatly display the create new job form while providing a nice loading experience using Suspense as model data is fetched and streamed from the server.

- For my server side api operations, I decided to use axios.js since axios automatically throws an error on non success status codes. This helped me write more maintainable error handling logic.

- For client side polling, I created a GET /jobs api inside src/app/api/jobs/route.tsx so that we don't expose the API key on the front end.

### Component design

- I decided to use shadcn components: https://ui.shadcn.com/ which provide a professional look out of the box while allowing for maximum customization, since they follow a source code copy + paste model with their CLI.

- An example of a shadcn component I modified includes the PaginationLink component, which I edited so that I could prevent the default behavior of scrolling to the top of the page each time a navigation was performed.

Some of the most noteworthy components in this repository include:

- PageLayout
  - I created a PageLayout component so that I could define a slot for both the content and header of different pages. I felt that defining the header component inside of each page directory was more maintainable.
- Wizard
  - Manages the layout of the header, description, and content of each step in a wizard (aka multistep) workflow.
- CreateNewJob form
  - Wraps the wizard component in the steps needed to complete the "create new job" form. Given more time, it might be worth extracting some of the logic here into a "MultiStepForm" component to handle the functionality of
    1. Validating only the form fields which are shown on the current "step" of the wizard
    2. Handling the response from the server for both field and form errors. Changing the step of the wizard to display the first field error.
    3. (In the future) storing the current state of the form in localStorage incase the user accidentally navigates away from the form
    4. (In the future) logic to prevent navigation away from the from if data is not yet submitted

### Response Handling: Managing loading, error, and success states

- For managing loading states I wrapped data fetching components (like the jobs table and jobs chart) in suspense boundaries to provide a nice UX while the rendered server components are being streamed from the server.

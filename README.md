AI generated README. My personal notes are under `Development reasoning and explanations` at the bottom.

# White Label Supermarket

A simple e‑commerce project built with Next.js (App Router). It showcases a product catalogue and a lightweight shopping cart, with a focus on composable UI and testability.

## Tech stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Formik and Yup for form validation
- ESLint + Prettier for code linting and formatting
- Jest + ts-jest + Testing Library for unit and component tests

## Prerequisites
- Node.js 18.18+ (LTS recommended)
- npm (comes with Node). Yarn/PNPM are not required for this project.

## Getting started
1. Install dependencies:
   - npm install
2. Run the dev server:
   - npm run dev
3. Open the app:
   - http://localhost:3000

## Available scripts
- npm run dev — Start the development server (Turbopack)
- npm run build — Build the production bundle (Turbopack)
- npm run start — Start the production server
- npm run lint — Run ESLint
- npm run test — Run the Jest test suite

## Testing
- The project uses Jest (jsdom) with Testing Library. Coverage is enabled by default and written to the coverage/ folder.
- Some Next.js features are mocked for tests (for example next/image via test/__mocks__/nextImageMock.tsx).

## Configuration
- TypeScript configuration: tsconfig.json
- Next.js configuration: next.config.ts
- Jest configuration: jest.config.ts
- ESLint configuration: eslint.config.mjs

## Backend / API
This project includes a minimal backend implemented with Next.js Route Handlers under `app/api`.
- Endpoints:
  - GET /api/products — returns all products available.
  - GET /api/discounts — returns all available discounts.
  - GET /api/discounts/:id — returns a single discount by id (404 if not found).
- Data source: static in-memory array at `app/api/discounts/discounts.ts` (no database required).
- No environment variables or external services are needed for local development.
- CORS: When consumed from this Next.js app, requests are same-origin and need no extra configuration. If you consume these endpoints from another origin, add appropriate headers in the route handlers.


## Development reasoning and explanations

Since this is a Frontend-focused role, I decided to go with a minimal backend. I did not want to spend time on a database, so I went with a simple in-memory array.

I decided to go with Next.js as a frontend framework because I believe it's the best choice for an e-commerce project since it's more SEO-friendly than a basic React SPA, has a great developer experience, and is easy to scale. Also, the App Router is now the default routing solution in Next.js, and I find it better than the `pages` structure.

Because there are only three products, I decided to go with a simple product list on the homepage. I didn't see a reason to build an individual product page, but it would be necessary if the project grew.

For the checkout, again, being a simple project, there was no need to implement a `user` logic, with sign-up, sign-in, etc. A simple cart, with a basic checkout form, was enough.

For the `buy-one-get-one-free` I chose to automatically add a second product to the cart when the user adds the first one. One other option (and most likely the better) would have been to display the extra products in the cart as free. However, I decided this one was simpler.

Some UI features that could've been a nice addition were using a library for icons, and some toasts to display success/warning/error messages. I chose not to spend time on them. Also, the design is very basic and could be improved.


### Dev tools AI usage

- I used `create-next-app` to generate the project.
- I'm using Jetbrains WebStorm as my IDE. It has an AI Chat that can be used for answering questions and a built-in AI assistant called Junie that can be used for code completion and generation. It has access to all major AI tools, like ChatGPT, Claude, Gemini, and more.
- I told the AI to generate the JSX content for the pages and to style it with Tailwind. It's way better than writing the same basic code by hand, and much faster.
- As the project progressed, I gave it more instructions for different parts of the project. It's not a perfect tool, so I manually reviewed all the generated code and made adjustments or simplified the code where needed.
- I also used it when I decided to majorly refactor the code. What I would've done in half an hour, it was done in 5 minutes.
- Because my testing experience is very limited, I asked the AI to generate tests for the project. Besides the fact that all code should be tested, because when I first started to look into Jest and testing, AI wasn't a tool that I could use, I'm also using this opportunity to learn more about testing.
- I believe that AI is definitely part of the future of software development. As long as you don't use it blindly to churn out code, without having an idea what that code does, it's a powerful tool that makes the development process much faster and more enjoyable.

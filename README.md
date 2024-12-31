# Translate Menu

Translate Menu is a Next.js application that uses AI to translate menus from images, providing travelers and food enthusiasts with instant menu translations and recommendations. This repository includes both the web front-end and a Supabase backend that stores user and generation data.

## Features

- AI-Powered Menu Translation: Upload a menu image, and the application automatically translates it into the desired language.
- Dish Recommendations: Personalized recommendations based on your dietary preferences.
- Rich User Interface: Built with Next.js, Tailwind CSS, and Radix UI components.
- Authentication: Handled by Clerk for user sign-ups, logins, and secure sessions.
- Supabase Integration: Manages user data, dish data, and other persistent information.

## Getting Started

Follow these steps to run the application locally.

### Prerequisites

1. Node.js (version 16 or above is recommended)
2. Yarn or npm (choose whichever you prefer)
3. Supabase CLI (optional, if you plan to run the Supabase backend locally)
4. Clerk account (optional, but necessary for production usage of authentication)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/your-username/translate-menu.git
   ```
2. Navigate into the project directory:
   ```
   cd translate-menu
   ```
3. Install the dependencies:

   ```
   # Using yarn
   yarn install

   # or using npm
   npm install
   ```

### Environment Variables

You’ll need environment variables for Supabase and Clerk.

Create a file named `.env` at the root of your project and provide the required keys:

@Codebase Write readme

# Translate Menu

Translate Menu is a Next.js application that uses AI to translate menus from images, providing travelers and food enthusiasts with instant menu translations and recommendations. This repository includes both the web front-end and a Supabase backend that stores user and generation data.

## Features

- AI-Powered Menu Translation: Upload a menu image, and the application automatically translates it into the desired language.
- Dish Recommendations: Personalized recommendations based on your dietary preferences.
- Rich User Interface: Built with Next.js, Tailwind CSS, and Radix UI components.
- Authentication: Handled by Clerk for user sign-ups, logins, and secure sessions.
- Supabase Integration: Manages user data, dish data, and other persistent information.

## Getting Started

Follow these steps to run the application locally.

### Prerequisites

1. Node.js (version 16 or above is recommended)
2. Yarn or npm (choose whichever you prefer)
3. Supabase CLI (optional, if you plan to run the Supabase backend locally)
4. Clerk account (optional, but necessary for production usage of authentication)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/your-username/translate-menu.git
   ```
2. Navigate into the project directory:
   ```
   cd translate-menu
   ```
3. Install the dependencies:

   ```
   # Using yarn
   yarn install

   # or using npm
   npm install
   ```

### Environment Variables

You’ll need environment variables for Supabase and Clerk.

Create a file named `.env` at the root of your project and provide the required keys:

SUPABASE_URL=<YOUR_SUPABASE_PROJECT_URL>
SUPABASE_KEY=<YOUR_SUPABASE_SERVICE_KEY>
CLERK_PUBLISHABLE_KEY=<YOUR_CLERK_PUBLISHABLE_KEY>
CLERK_SECRET_KEY=<YOUR_CLERK_SECRET_KEY>

Refer to your Supabase and Clerk dashboards to obtain these values.

### Running the App

1. Run the development server:
   ```
   yarn dev
   ```
   or
   ```
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Optional: Running Supabase Locally

If you want a local Supabase backend:

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli).
2. Run:
   ```
   supabase start
   ```
3. Adjust your `.env` to point to the local Supabase URL and generated service key.

## Project Structure

- `app/` — Next.js route handlers, pages, and layout components.
- `components/` — Reusable UI components (buttons, alerts, dropdowns, etc.).
- `db/` — Database helper functions and Supabase client configuration.
- `schemas/` — Zod schemas for validating and typing data.
- `state/` — Global context for managing user preferences.
- `supabase/` — Supabase configuration and migration files.
- `tailwind.config.ts` — Tailwind CSS configuration.

## Deployment

You can deploy this application using any Next.js-supported platform (e.g., Vercel). For Supabase, you can host it on Supabase Cloud or run it on your own server.

## Contributing

Contributions are welcome! To contribute:

1. Fork this repository.
2. Create a new branch for your feature or fix.
3. Make your changes and add tests if relevant.
4. Open a pull request describing your changes.

## License

MIT License. See the [LICENSE](LICENSE) file for details.

---

Happy translating!

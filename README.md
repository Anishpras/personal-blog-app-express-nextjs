# Personal Blog Platform

This project is a personal blog platform built with a Node.js/Express backend and a Next.js 14 frontend. Users can sign up, log in, create posts, and view all posts or filter them by author.

## Project Structure

The project is divided into two main directories:

- `backend/`: Contains the Express.js API
- `frontend/`: Contains the Next.js 14 application

# Backend Structure and Development Choices

## Project Structure

The backend of my personal blog platform is built using Node.js with Express.js and Prisma ORM. Here's an overview of the project structure and the choices I made during development:

```
backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── middleware/
│   │   └── auth.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── posts.ts
│   │   └── authors.ts
│   └── utils/
│   │   ├── validateEnv.ts
│   └── index.ts
├── .env
├── package.json
└── tsconfig.json
```

## Key Components

### 1. Database Schema (Prisma)

I used Prisma as my ORM and database toolkit. The `schema.prisma` file defines my data models:

- **User**: Represents blog users with fields for id, email, and password.
- **Post**: Represents blog posts with fields for id, title, content, authorId, createdAt, and updatedAt.

Prisma provides type-safe database access and simplifies database operations.

### 2. API Routes

I've organized my API routes into separate files for better modularity:

- **auth.ts**: Handles user authentication (signup and login).
- **posts.ts**: Manages CRUD operations for blog posts.
- **authors.ts**: Retrieves author information.

### 3. Authentication

I implement JWT (JSON Web Token) based authentication:

- Passwords are hashed using bcrypt before storage.
- JWTs are issued upon successful login and used to authenticate subsequent requests.
- A custom middleware (`auth.ts`) verifies JWTs for protected routes.

### 4. Main Application (index.ts)

The main application file sets up the Express server, applies middleware (CORS, JSON parsing), and registers the route handlers.

## Development Choices

1. **TypeScript**: I chose TypeScript for improved developer experience, static typing, and better tooling support.

2. **Prisma ORM**: I selected Prisma for its type-safe database access, ease of use, and powerful migration capabilities.

3. **RESTful API Design**: I implemented a RESTful API structure for intuitive and standardized endpoints.

4. **JWT Authentication**: JWT provides a stateless authentication mechanism, suitable for scalable applications.

5. **Environment Variables**: Sensitive information (database URL, JWT secret) is stored in environment variables for security.

6. **Error Handling**: I've implemented basic error handling throughout the application, with specific error messages for different scenarios.

7. **CORS**: Cross-Origin Resource Sharing is enabled to allow requests from the frontend application.

8. **Modular Route Structure**: Routes are organized into separate files for better code organization and maintainability.

## Future Improvements

- Implement input validation using a library like Joi or express-validator.
- Add unit and integration tests for robust code quality.
- Implement rate limiting to prevent abuse of the API.
- Set up logging for better debugging and monitoring.
- Consider implementing refresh tokens for enhanced security.

This backend structure provides a solid foundation for the personal blog platform, with clear separation of concerns and room for future enhancements.

# Frontend Architecture and Development Choices

## Project Structure

The frontend of my personal blog platform is built using Next.js 14 with TypeScript. Here's an overview of the project structure and the choices I made during development:

```
frontend/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── post/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── error.tsx
│   └── page.tsx
├── components/
│   ├── molecules/
│   │   ├── HomePageClient.tsx
│   │   └── PostPageClient.tsx
│   ├── ui/
│   │   ├── alert-dialog.tsx
│   │   ├── animated-grid-pattern.tsx
│   │   ├── avatar.tsx
│   │   ├── border-beam.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── shimmer-button.tsx
│   │   ├── shiny-button.tsx
│   │   ├── textarea.tsx
│   │   └── typing-animation.tsx
│   ├── AuthProvider.tsx
│   ├── ClientErrorBoundary.tsx
│   ├── ErrorFallback.tsx
│   ├── ErrorMessage.tsx
│   ├── Loading.tsx
│   ├── Navbar.tsx
│   ├── Post.tsx
│   └── RichTextEditor.tsx
├── lib/
│   ├── api.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── middleware.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Key Components and Features

### 1. Next.js 14 with App Router

I've adopted Next.js 14 with its App Router for improved performance and easier server-side rendering. This allows for better SEO and initial load times.

### 2. TypeScript

TypeScript is used throughout the project for type safety and improved developer experience.

### 3. Authentication (NextAuth.js)

I use NextAuth.js for authentication, providing a secure and flexible authentication system. The `AuthProvider` component wraps the application to provide session information globally.

### 4. API Integration

The `api.ts` file in the `lib` folder centralizes all API calls, making it easier to manage and update API endpoints.

### 5. Rich Text Editor

I've implemented a custom `RichTextEditor` component using `@mantine/tiptap` for creating and editing blog posts with advanced formatting options.

### 6. Responsive Design

The application is designed to be fully responsive, using Tailwind CSS for styling and layout.

### 7. Custom UI Components

I've created several UI components (e.g., `ShinyButton`, `ShimmerButton`) to enhance the user interface and provide a unique user experience from Shadcn UI and some from Magic UI.

### 8. Client-Side and Server-Side Rendering

I utilize both client-side and server-side rendering strategies to optimize performance and SEO.

### 9. Error Handling and Loading States

Custom `ErrorMessage` and `Loading` components are used throughout the application to provide clear feedback to users during asynchronous operations.

## Development Choices

1. **Next.js 14**: Chosen for its powerful features, and the project requirement, including server-side rendering, static site generation, and the new App Router.

2. **TypeScript**: Improves code quality and developer productivity through static typing.

3. **Tailwind CSS**: Provides a utility-first approach to styling, allowing for rapid UI development and easy customization.

4. **NextAuth.js**: Offers a flexible and secure authentication solution that integrates well with Next.js.

5. **Mantine UI**: Used for the rich text editor, providing a powerful and customizable editing experience.

6. **Custom Hooks**: Implemented for managing state and side effects, promoting code reusability and separation of concerns.

7. **Modular Component Structure**: Components are organized into logical folders (e.g., `molecules`, `ui`) for better maintainability.

8. **Environment Variables**: Sensitive information and configuration settings are stored in environment variables for security and flexibility across different environments.

9. **Other helper packages**: Used Shadcn UI, Magic UI components, sonner, etc for quick development.

## Future Improvements

- Implement client-side caching for improved performance
- Add automated testing (unit tests, integration tests, and end-to-end tests)
- Enhance accessibility features
- Implement internationalization (i18n) for multi-language support
- Add more interactive elements and animations for a richer user experience

This frontend architecture provides a solid foundation for the personal blog platform, with a focus on performance, user experience, and maintainability.

## Prerequisites

- Node.js (v18 or later)
- pnpm, npm or yarn
- PostgreSQL database
- Git

## Setup Instructions

### Cloning the Repository

1. Open your terminal and run the following command to clone the repository:

   ```
   git clone https://github.com/Anishpras/personal-blog-app-express-nextjs.git
   ```

2. Navigate to the project directory:

   ```
   cd personal-blog-app-express-nextjs
   ```

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   pnpm i
   ```

3. Create a `.env` file in the `backend/` directory with the following content:

   ```
   DATABASE_URL=postgresql://[username]:[password]@localhost:5432/[database_name]
   JWT_SECRET="your-secret-key"
   PORT=3001
   ```

   Replace the `DATABASE_URL` with your actual PostgreSQL connection string if different.

4. Set up the database:

   ```
   npx prisma migrate dev
   ```

5. Build the project:
   ```
   pnpm build
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   pnpm i
   ```

3. Create a `.env` file in the `frontend/` directory with the following content:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXTAUTH_SECRET=your_secure_random_string_here
   NEXTAUTH_URL=http://localhost:3000
   ```

## Running the Application

### Running the Backend

1. In the `backend/` directory, start the server:
   ```
   pnpm dev
   ```
   The API will be available at `http://localhost:3001/api`.

### Running the Frontend

1. In the `frontend/` directory, start the Next.js development server:
   ```
   pnpm dev
   ```
   The application will be available at `http://localhost:3000`.

## Technology Stack

- Backend: Node.js, Express.js, Prisma ORM
- Frontend: Next.js 14, TypeScript
- Authentication: JWT
- Database: PostgreSQL

## Extra Note

- As few pages need to be static generated if the backend server is not running then the NextJs app will show TypeError something like this -

```

TypeError: fetch failed
    at node:internal/deps/undici/undici:12344:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
  cause: AggregateError
      at internalConnectMultiple (node:net:1114:18)
      at afterConnectMultiple (node:net:1667:5)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}

```

Just run the backend server then build the frontend and it will work fine.



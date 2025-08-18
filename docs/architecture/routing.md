# Routing

We will use the Next.js App Router's file-based system. Route protection will be handled by a single middleware.ts file at the project root, which checks for a session token and redirects unauthenticated users from protected paths.

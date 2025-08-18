# Project Structure

Plaintext

```
/
├── app/                  # Next.js App Router
│   ├── (main)/             # Main application pages route group
│   │   ├── layout.tsx        # Main layout (e.g., with nav header)
│   │   ├── page.tsx          # Homepage (chronological "Spaces" gallery)
│   │   ├── index/            # Route for the "Index" page
│   │   └── ...
│   ├── (auth)/             # Auth pages route group
│   │   ├── login/
│   │   └── signup/
│   ├── api/                # API Routes (serverless functions)
│   └── globals.css         # Global styles
├── components/           # Reusable React components
│   ├── ui/                 # General, reusable UI (e.g., Button, Card, Input)
│   ├── features/           # Feature-specific components (e.g., CommissionForm)
│   └── shared/             # Complex components shared across pages
├── lib/                  # Utility functions, services, helper scripts
├── hooks/                # Custom React hooks
├── stores/               # Zustand state management stores
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma
├── public/               # Static assets (images, fonts)
├── .env.local            # Local environment variables (DO NOT COMMIT)
├── .env.example          # Example environment variables
├── middleware.ts         # For protecting routes
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

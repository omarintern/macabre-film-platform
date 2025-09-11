# DRAFT: Film Collaboration Platform Product Requirements Document (PRD)
*Version 1.0*

## 1. Goals and Background Context

### Goals
* To provide a professional, streamlined, and discoverable platform for screenplay writers to showcase their work.
* To create a centralized marketplace for producers and directors to find high-quality synopsis writers and commission custom scripts.
* To become the premier destination for screenplay collaboration in the independent film community.
* To enforce a discipline of concise, impactful storytelling through a **2000-character limit** on short-form works.

### Background Context
The film industry currently lacks a dedicated, streamlined platform for screenplay collaboration. Writers struggle to be discovered, while producers lack a centralized place to find talent. Existing platforms are often too generic or complex for the specific needs of film professionals. This project aims to solve this by creating a focused, minimalist platform that facilitates efficient and professional connections between creators and clients.

### Change Log
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| Aug 9, 2025 | 1.0 | Initial Draft | John, PM |

---
## 2. Requirements

### Functional
1.  **FR1:** The system shall allow all new users to sign up for a standard "Client" account and log in.
2.  **FR2:** Creators shall be able to create and manage a public profile to showcase their work.
3.  **FR3:** Creators shall be able to submit new short text works, which must adhere to a **2000-character limit** and can be tagged with genres and hashtags.
4.  **FR4:** All users (including non-logged-in visitors) shall be able to view the "Spaces" page, a gallery of works.
5.  **FR5:** The system shall feature an "Index" page, which displays a master list of all navigable tags and hashtags associated with submitted works.
6.  **FR6:** Clicking a tag or hashtag on the "Index" page shall navigate the user to a view showing all works associated with it.
7.  **FR7:** Clients shall be able to initiate a commission request from a Creator's profile page.
8.  **FR8:** The system shall send a notification to a Creator when a Client initiates a commission request.
9.  **FR9:** The system shall provide an administrative function for authorized personnel to upgrade a "Client" account to a "Creator" account.

### Non-Functional
1.  **NFR1:** The user interface must maintain the clean, professional, and minimalist design aesthetic defined in the Project Brief.
2.  **NFR2:** The platform must be highly performant, with a focus on fast page loads, especially for the content galleries.
3.  **NFR3:** The user interface must be fully responsive and provide a seamless experience on desktop, tablet, and mobile web browsers.
4.  **NFR4:** All user authentication and data storage must be secure, protecting user credentials and intellectual property.
5.  **NFR5:** The system shall be built using the specified technology stack: Next.js, Tailwind CSS, Prisma, and NeonDB.

---
## 3. User Interface Design Goals

### Overall UX Vision
The user experience must be clean, professional, and content-forward, inspired by the minimalist aesthetic of sites like Barnsworthburning.net. The design should feel uncluttered and intuitive, allowing the creative work to be the absolute focus.

### Key Interaction Paradigms
* **Submission Flow:** A simple, elegant form for submitting works that guides the creator.
* **Discovery:** An immersive Browse experience through the "Index" and "Spaces" pages.
* **Commissions:** A clear and straightforward process for clients to request commissions.

### Core Screens and Views
* Homepage / "Spaces" Gallery
* "Index" Page (Master list of tags and hashtags)
* Work Detail Page
* Public Creator Profile Page
* Client Dashboard
* Sign-Up / Login Flow
* Admin Panel (for user role management)

### Accessibility
* **Target:** The platform will adhere to WCAG 2.1 AA standards as a baseline.

### Branding
* **Inspiration:** The primary visual and experiential inspiration is Barnsworthburning.net. The initial design will be based on minimalism, using a limited color palette and strong typography.

### Target Device and Platforms
* **Platform:** Web Responsive. The application will be designed with a mobile-first approach.

---
## 4. Technical Assumptions

### Repository Structure: Monorepo
* A monorepo will be used to manage the frontend and backend code in a single repository to simplify dependency management and code sharing.

### Service Architecture: Serverless
* The backend will be built using a serverless architecture to complement the serverless database, ensure scalability, and maintain cost-efficiency.

### Testing Requirements: Unit + Integration
* The testing strategy will include both unit tests for individual components/functions and integration tests to ensure different parts of the system work together correctly.

### Additional Technical Assumptions and Requests
* **Frontend:** Next.js with TypeScript and Tailwind CSS.
* **Backend:** A Node.js framework with Prisma as the ORM.
* **Database:** NeonDB (Serverless Postgres).
* **Deployment:** The Vercel platform will be the primary deployment target.

---
## 5. Epic List

1.  **Epic 1: Foundation, User Accounts & Creator Onboarding**
    * **Goal:** Establish the core application infrastructure, implement a universal account system for "Clients", and build the administrative function to designate "Creators".
2.  **Epic 2: Content Submission & "Spaces" Gallery**
    * **Goal:** Enable designated "Creators" to submit their various short text works and display them publicly in the "Spaces" gallery.
3.  **Epic 3: Discovery & Commissioning**
    * **Goal:** Implement the "Index" page for content discovery and enable "Clients" to initiate script commission requests to "Creators", and allow creators to upload full PDF scripts to their portfolios.

---
## 6. Epic Details

### Epic 1: Foundation, User Accounts & Creator Onboarding
**Goal:** To lay the essential groundwork for the application, including project setup, the core user account system, and the admin functionality to promote users to the 'Creator' role.

#### Story 1.1: Project Initialization & Setup
**As a** developer, **I want** a new monorepo project initialized with the correct frontend and backend applications, **so that** I can begin development with the standard tooling and structure.
* **Acceptance Criteria:**
    1.  A new monorepo is created and configured.
    2.  A Next.js/Tailwind/TypeScript application is set up in `apps/web`.
    3.  A Node.js/Prisma/TypeScript application is set up in `apps/api`.
    4.  Prisma is successfully connected to the NeonDB database.
    5.  The project runs locally without configuration errors.

#### Story 1.2: User Model & Database Schema
**As a** developer, **I want** the `User` model and initial database schema created, **so that** user data can be persisted correctly.
* **Acceptance Criteria:**
    1.  A `User` model is defined in the Prisma schema.
    2.  The model includes fields for an ID, email, hashed password, and a `role` ('CLIENT', 'CREATOR', 'ADMIN').
    3.  The default role for a new user is 'CLIENT'.
    4.  The schema is successfully migrated to the development database.

#### Story 1.3: User Sign-up
**As a** new user, **I want** to be able to sign up for an account with my email and password, **so that** I can access the platform.
* **Acceptance Criteria:**
    1.  A sign-up page with email and password fields is available.
    2.  Upon successful submission, a new user record is created with the 'CLIENT' role.
    3.  The password is securely hashed and salted before being stored.
    4.  The user is redirected to the login page after a successful sign-up.

#### Story 1.4: User Login & Logout
**As a** registered user, **I want** to be able to log in and log out, **so that** I can securely manage my session.
* **Acceptance Criteria:**
    1.  A login page with email and password fields is available.
    2.  Upon successful authentication, a secure session is created.
    3.  The user can access areas of the site that require authentication.
    4.  A logout mechanism is available that securely terminates the session.

#### Story 1.5: Admin Function to Promote User
**As an** admin, **I want** to be able to change a user's role from 'Client' to 'Creator', **so that** they can access creator-specific functionality.
* **Acceptance Criteria:**
    1.  A secure, admin-only mechanism exists to change a user's role.
    2.  The admin can target a user by their ID or email.
    3.  The function successfully changes the user's role in the database from 'CLIENT' to 'CREATOR'.
    4.  Only authenticated users with the 'ADMIN' role can perform this action.

### Epic 2: Content Submission & "Spaces" Gallery
**Goal:** To build the core creative functionality, allowing Creators to submit various short text works and making them browsable to all users in the "Spaces" gallery.

#### Story 2.1: Creator Profile Page
**As a** Creator, **I want** a dedicated public profile page, **so that** I have a professional space to showcase my works and information.
* **Acceptance Criteria:**
    1.  Authenticated users with the 'CREATOR' role can access a page to edit their profile information.
    2.  A Creator's profile is publicly viewable at a unique URL.
    3.  The public profile displays the Creator's name, bio, and a section for their submitted works.
    4.  Users with the 'CLIENT' role do not have this public-facing profile type.

#### Story 2.2: Content Submission Form
**As a** Creator, **I want** a simple form to submit a new short text work, **so that** I can add it to my portfolio.
* **Acceptance Criteria:**
    1.  A "Submit New Work" button is visible to authenticated 'CREATOR' users on the Spaces page.
    2.  The form includes fields for a Title, the Body of the work, and Tags/Hashtags.
    3.  A required field exists to classify the submission as "Synopsis", "Scene Description", or "Other".
    4.  The Body text field enforces a **2000-character maximum** (updated from 1000).
    5.  The Body text field uses smaller font size (text-xs) for better content density.
    6.  The new work is saved and associated with the logged-in Creator.

#### Story 2.3: Display Works on Creator Profile
**As a** user, **I want** to see a list of works on a Creator's public profile page, **so that** I can review their body of work.
* **Acceptance Criteria:**
    1.  All short text works by a Creator are displayed on their public profile page.
    2.  Each work in the list displays its Title and its classification ("Synopsis", etc.).
    3.  The list is ordered with the most recently submitted work first.

#### Story 2.4: "Spaces" Gallery Page
**As a** user, **I want** to visit a "Spaces" page, **so that** I can browse all the short text works submitted on the platform.
* **Acceptance Criteria:**
    1.  A publicly accessible "Spaces" page is linked in the main navigation.
    2.  The page displays a gallery of all submitted short text works.
    3.  The gallery is paginated for performance.
    4.  Each work in the gallery displays its Title, classification, and the Creator's name.

### Epic 3: Discovery & Commissioning
**Goal:** To implement the core marketplace functionality, including the "Index" page for discovery, the commission request system, and the ability for Creators to upload full PDF scripts to their portfolios.

#### Story 3.1: "Index" Page of Tags & Hashtags
**As a** user, **I want** to view an "Index" page that lists all tags and hashtags, **so that** I can discover works based on specific themes.
* **Acceptance Criteria:**
    1.  An "Index" page is created and linked in the main navigation.
    2.  The page displays a list of all unique tags and hashtags used on submitted works.
    3.  Each tag/hashtag in the list is a clickable link.

#### Story 3.2: Tag Results Page
**As a** user, **I want** to see a gallery of all works associated with a tag after clicking it, **so that** I can explore relevant content.
* **Acceptance Criteria:**
    1.  Clicking a tag/hashtag on the "Index" page navigates to a results page.
    2.  The page displays a gallery of all works associated with that tag/hashtag.
    3.  The gallery format is consistent with the "Spaces" page.

#### Story 3.3: Commission Request Form
**As a** Client, **I want** to access a commission request form on a Creator's profile, **so that** I can formally request a custom script.
* **Acceptance Criteria:**
    1.  A "Commission this Creator" button is visible on Creator profiles to logged-in Clients.
    2.  The button opens a form with fields for project title, description, budget, and deadline.
    3.  Submitting the form creates a "commission request" record in the database.

#### Story 3.4: Commission Notification
**As a** Creator, **I want** to receive a notification for a new commission request, **so that** I can review new opportunities.
* **Acceptance Criteria:**
    1.  An in-app notification is generated for the target Creator.
    2.  An email notification is sent to the Creator's registered email address.
    3.  The notification includes a summary of the request and a link to its details.

#### Story 3.5: PDF Script Submission
**As a** Creator, **I want** to upload a full script as a PDF to my profile, **so that** I can showcase my completed long-form works.
* **Acceptance Criteria:**
    1.  The "Submit New Work" page has a separate option for "Upload Script".
    2.  The interface allows a Creator to upload a PDF file.
    3.  The uploaded script is stored securely and listed in a "Scripts" section on the Creator's profile.
    4.  Uploaded scripts **do not** appear in the public "Spaces" gallery.


# 🧪 **QA DOCUMENTATION UPDATE: Character Limit & Font Size Changes**

## **📋 DOCUMENTS TO UPDATE:**

### **1. Story 2.2: Content Submission Form** ✅ **PRIORITY UPDATE**

```markdown:docs/stories/2.2.content-submission-form.md
# Story 2.2: Content Submission Form

## Status
Done ✅ (Updated: 2000-character limit, smaller font)

## Story  
**As a** Creator, **I want** a simple form to submit a new short text work, **so that** I can add it to my portfolio.

## Acceptance Criteria
1. A "Submit New Work" button is visible to authenticated 'CREATOR' users on the Spaces page.
2. The form includes fields for a Title, the Body of the work, and Tags/Hashtags.
3. A required field exists to classify the submission as "Synopsis", "Scene Description", or "Other".
4. The Body text field enforces a **2000-character maximum** (updated from 1000).
5. The Body text field uses smaller font size (text-xs) for better content density.
6. The new work is saved and associated with the logged-in Creator.

## Implementation Updates (2025-01-27)
- ✅ **Character Limit**: Increased from 1000 to **2000 characters**
- ✅ **Font Size**: Reduced to `text-xs` for better readability of longer content
- ✅ **Textarea Rows**: Increased to 8 rows for better editing experience
- ✅ **Architecture**: Migrated to 100% Firebase (Firestore + Auth + Realtime DB)
- ✅ **UI**: Modal-based submission on Spaces page (replaced dedicated submit page)
```

### **2. PRD Requirements** ✅ **CRITICAL UPDATE**

```markdown:docs/prd/2-requirements.md
# 2. Requirements

## Functional
1.  **FR1:** The system shall allow all new users to sign up for a standard "Client" account and log in.
2.  **FR2:** Creators shall be able to create and manage a public profile to showcase their work.
3.  **FR3:** Creators shall be able to submit new short text works, which must adhere to a **2000-character limit** and can be tagged with genres and hashtags.
4.  **FR4:** All users (including non-logged-in visitors) shall be able to view the "Spaces" page, a gallery of works.
5.  **FR5:** The system shall feature an "Index" page, which displays a master list of all navigable tags and hashtags associated with submitted works.
6.  **FR6:** Clicking a tag or hashtag on the "Index" page shall navigate the user to a view showing all works associated with it.
7.  **FR7:** Clients shall be able to initiate a commission request from a Creator's profile page.
8.  **FR8:** The system shall send a notification to a Creator when a Client initiates a commission request.
9.  **FR9:** The system shall provide an administrative function for authorized personnel to upgrade a "Client" account to a "Creator" account.

## Non-Functional
1.  **NFR1:** The user interface must maintain the clean, professional, and minimalist design aesthetic defined in the Project Brief.
2.  **NFR2:** The platform must be highly performant, with a focus on fast page loads, especially for the content galleries.
3.  **NFR3:** The user interface must be fully responsive and provide a seamless experience on desktop, tablet, and mobile web browsers.
4.  **NFR4:** All user authentication and data storage must be secure, protecting user credentials and intellectual property.
5.  **NFR5:** The system shall be built using the specified technology stack: Next.js, Tailwind CSS, Prisma, and NeonDB.

---
```

### **3. Main
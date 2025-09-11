# New Design Tokens - Synopsis Hub Aesthetic

## 🎨 **Color Palette**

### **Primary Colors (Minimal Usage)**
```css
--primary: #1a1a1a;        /* Dark gray for text */
--primary-light: #404040;  /* Medium gray for secondary text */
```

### **Background Colors**
```css
--background: #ffffff;           /* Pure white */
--background-secondary: #fafafa; /* Subtle off-white */
--background-card: #ffffff;      /* White cards */
```

### **Content Card Colors (Subtle Pastels)**
```css
--card-orange: #fff5f0;  /* Action/Mystery */
--card-red: #fef2f2;     /* Horror/Thriller */
--card-green: #f0fdf4;   /* Drama/Character */
--card-pink: #fdf2f8;    /* Romance */
--card-blue: #f0f9ff;    /* Sci-fi/Fantasy */
```

### **Border and Divider Colors**
```css
--border: #e5e5e5;       /* Subtle gray */
--border-light: #f0f0f0; /* Very light gray */
```

### **Text Colors**
```css
--text-primary: #1a1a1a;   /* Dark gray */
--text-secondary: #6b7280; /* Medium gray */
--text-muted: #9ca3af;     /* Light gray */
```

## 🔤 **Typography**

### **Form Field Font Sizes**
```css
--form-text-xs: 0.75rem;    /* 12px - Work submission content (dense text) */
--form-text-sm: 0.875rem;   /* 14px - Form labels and inputs */
--form-text-base: 1rem;     /* 16px - Standard form text */
```

### **Content Submission Specifications**
- **Character Limit**: 2000 characters maximum
- **Font Size**: `text-xs` (12px) for content density
- **Textarea Rows**: 8 rows for comfortable editing

## 📐 **Spacing**

### **Padding and Margins**
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

## 🎯 **Component Variants**

### **Button Variants**
```css
/* Primary - Dark text on white */
.btn-primary {
  background: var(--background);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

/* Secondary - Light text on transparent */
.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
}

/* Ghost - Minimal styling */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: none;
}
```

### **Card Styling**
```css
.card {
  background: var(--background-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: var(--space-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
```

## 📱 **Layout Breakpoints**

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

## 🎨 **Usage Guidelines**

### **Typography Hierarchy**
- **Page titles:** `font-serif`, `text-3xl` or `text-4xl`
- **Card titles:** `font-sans`, `text-lg`, `font-medium`
- **Body text:** `font-sans`, `text-base`
- **Navigation:** `font-sans`, `text-sm`, `font-medium`

### **Color Usage**
- **Primary text:** `text-primary` for main content
- **Secondary text:** `text-secondary` for descriptions
- **Muted text:** `text-muted` for metadata
- **Card backgrounds:** Use pastel colors based on content type

### **Spacing Patterns**
- **Card padding:** `space-6` (24px)
- **Section spacing:** `space-12` (48px)
- **Component gaps:** `space-4` (16px)
- **Text spacing:** `space-2` (8px) between elements

# 🧪 **QA IDENTIFIED: Exact Code Changes Needed**

## **🚨 WHY SITE STILL SHOWS 1000 CHARACTERS:**

The actual **code files haven't been updated yet**! Here are the exact changes needed:

### **📁 File 1: `apps/web/components/features/WorkSubmissionModal.tsx`**

**Line 46:** 
```typescript
// CURRENT:
const maxBodyLength = 1000;
// CHANGE TO:
const maxBodyLength = 2000;
```

**Line 255:**
```typescript  
// CURRENT:
rows={6}
// CHANGE TO:
rows={8}
```

**Line 258:**
```typescript
// CURRENT:
className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none...`}
// CHANGE TO:
className={`w-full px-4 py-3 border rounded-lg text-xs focus:outline-none...`}
```

### **📁 File 2: `apps/web/lib/services/workService.ts`**

**Line 145-146:**
```typescript
// CURRENT:
} else if (workData.body.length > 1000) {
  errors.push('Body must be 1000 characters or less');
// CHANGE TO:
} else if (workData.body.length > 2000) {
  errors.push('Body must be 2000 characters or less');
```

## **🔧 EXECUTION COMMANDS:**

```bash
# Fix WorkSubmissionModal.tsx
sed -i '' 's/maxBodyLength = 1000/maxBodyLength = 2000/' apps/web/components/features/WorkSubmissionModal.tsx
sed -i '' 's/rows={6}/rows={8}/' apps/web/components/features/WorkSubmissionModal.tsx  
sed -i '' 's/text-sm focus:outline-none/text-xs focus:outline-none/' apps/web/components/features/WorkSubmissionModal.tsx

# Fix workService.ts validation
sed -i '' 's/> 1000/> 2000/' apps/web/lib/services/workService.ts
sed -i '' 's/1000 characters or less/2000 characters or less/' apps/web/lib/services/workService.ts
```

**Execute these commands and the site will immediately show 2000 characters with smaller font!**

# 🧪 **QA EMERGENCY: Code Changes Not Applied**

The issue is that the code changes I identified haven't been executed yet! The site still shows 1000 characters because the actual component files still contain the old values.

Since I can't use terminal commands right now, let me provide you with the **exact manual changes** you need to make:

## **🔧 MANUAL CODE FIXES REQUIRED:**

### **File 1: `apps/web/components/features/WorkSubmissionModal.tsx`**

**Find Line 46 and change:**
```typescript
// CHANGE THIS:
const maxBodyLength = 1000;

// TO THIS:
const maxBodyLength = 2000;
```

**Find Line 255 and change:**
```typescript
// CHANGE THIS:
rows={6}

// TO THIS:
rows={8}
```

**Find Line 258 and change:**
```typescript
// CHANGE THIS:
className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 ${

// TO THIS:
className={`w-full px-4 py-3 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 ${
```

### **File 2: `apps/web/lib/services/workService.ts`**

**Find Line 145-146 and change:**
```typescript
// CHANGE THIS:
} else if (workData.body.length > 1000) {
  errors.push('Body must be 1000 characters or less');

// TO THIS:
} else if (workData.body.length > 2000) {
  errors.push('Body must be 2000 characters or less');
```

## **🎯 SUMMARY:**
- **Change `1000` to `2000`** in 3 places
- **Change `text-sm` to `text-xs`** in 1 place  
- **Change `rows={6}` to `rows={8}`** in 1 place

**After making these changes, the submission box will show "2000 characters remaining" with smaller font!**


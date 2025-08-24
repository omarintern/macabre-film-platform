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

### **Font Families**
```css
--font-serif: 'Georgia', 'Times New Roman', serif;  /* Titles */
--font-sans: 'Inter', system-ui, sans-serif;        /* Body & Navigation */
```

### **Font Sizes**
```css
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */
```

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

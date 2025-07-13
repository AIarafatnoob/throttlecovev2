
# 🛠️ ThrottleCove Development Documentation

## 📦 Project Overview

**ThrottleCove** is a modern vehicle management web application built using **React**, **TypeScript**, and **Vite**. It integrates a variety of UI components, image and document upload features, interactive carousels, and a backend configured with **Drizzle ORM**.

---

## 📁 Project Structure

```
ThrottleCove/
└── ThrottleCove/
    ├── client/                     # Frontend source code
    │   └── src/
    │       ├── App.tsx            # Main application component
    │       ├── main.tsx           # Entry point
    │       └── components/
    │           └── ui/            # Reusable UI components (ShadCN-like)
    ├── drizzle.config.ts          # Drizzle ORM config
    ├── package.json               # Project dependencies and scripts
    ├── postcss.config.js          # PostCSS configuration
    ├── tailwind.config.ts         # TailwindCSS configuration
    ├── tsconfig.json              # TypeScript configuration
    ├── vite.config.ts             # Vite bundler configuration
```

---

## 🧰 Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **Bundler**: Vite
- **UI Components**: Custom & ShadCN-UI based
- **State Management**: React state (hooks-based)
- **ORM**: Drizzle (for future database interactions)
- **Hosting**: Replit-supported structure

---

## 🚀 Installation & Setup

```bash
# Clone the repo
git clone <your-repo-url>
cd ThrottleCove/ThrottleCove

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🧩 Core Features

### 1. 📄 Document Upload
Located in: `components/ui/DocumentUpload.tsx`  
- Allows users to upload and preview documents

### 2. 🖼️ Photo Upload
Located in: `components/ui/PhotoUpload.tsx`  
- Drag-and-drop or file selection
- Image preview and validation

### 3. 🌀 Carousel Components
- `PartsCarousel.tsx`: Custom horizontal carousel
- `VerticalCarousel.tsx`: Vertical scroll-based image viewer

### 4. 📊 Chart Integration
- Built-in UI chart (`components/ui/chart.tsx`)

### 5. 📅 Calendar & Form UI
- Tailored date selectors, inputs, and dialog components

---

## 🧱 Component Architecture

Follows a **modular UI** system inspired by **ShadCN/UI**:

Each component is:
- Type-safe (written in `.tsx`)
- Individually styled using Tailwind
- Responsive and reusable

```tsx
// Example: Button usage
import { Button } from "@/components/ui/button";

<Button className="w-full" variant="outline">Click Me</Button>
```

---

## ⚙️ Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Frontend build & development server |
| `tailwind.config.ts` | Design system with Tailwind |
| `tsconfig.json` | TypeScript project rules |
| `drizzle.config.ts` | ORM config |
| `.replit` | Replit environment support |

---

## 🧪 Testing (Recommended Setup)

This project doesn't include tests yet. You can add:

- **Unit Tests**: `Vitest` or `Jest`
- **Component Tests**: `React Testing Library`
- **E2E Tests**: `Cypress`

---

## ☁️ Deployment

You can deploy the frontend to platforms like:

- **Vercel**
- **Netlify**
- **Render**
- **Replit** (built-in support)

Ensure the `vite.config.ts` has correct base paths if deployed in a subdirectory.

---

## 🛣️ Future Enhancements

- Integrate a backend API (Node, Express, etc.)
- Enable database with Drizzle + PostgreSQL or SQLite
- Add authentication (e.g., Clerk, Auth0, Firebase)
- Mobile responsiveness enhancements
- Persistent state (localStorage / database)

---

## 🧾 Appendix

- **Drizzle ORM**: https://orm.drizzle.team/
- **ShadCN/UI**: https://ui.shadcn.dev/
- **Vite**: https://vitejs.dev/

---

**Maintainer**: _Your Name_  
**Last Updated**: June 2025

# Frontend Guidelines Document

This document outlines the frontend setup, architecture, design principles, and technologies for the **housebulding** project. Everyone—from new team members to stakeholders—should get a clear understanding of how the frontend works and why it’s organized this way.

## 1. Frontend Architecture

**Framework & Core Libraries**
- **React with TypeScript**: Provides component-based UI building with type safety.
- **Vite** (or Create React App): Blazing-fast development server and optimized production builds.
- **React Router**: Manages client-side routing.

**Folder Structure**
```
src/
 ├── assets/          # Images, fonts, icons
 ├── components/      # Reusable UI components (atoms, molecules)
 ├── hooks/           # Custom React hooks
 ├── pages/           # Route-level components
 ├── services/        # API calls, utility functions
 ├── store/           # Redux slices and store setup
 ├── styles/          # Global styles, theme config
 └── App.tsx          # Root component with Router and Providers
```

**How It Supports Scalability & Maintainability**
- **Modular components** let teams work on small, self-contained pieces.
- **TypeScript** catches errors early, reducing runtime bugs.
- **Centralized services** and store make business logic easy to find and update.
- **Vite’s** build optimizations keep bundles lean and fast.

## 2. Design Principles

1. **Usability**
   - Simple, clear interfaces.
   - Consistent patterns for buttons, forms, and navigation.

2. **Accessibility (a11y)**
   - Semantic HTML (e.g., `<nav>`, `<main>`, `<header>`).
   - WAI-ARIA roles and labels for screen readers.
   - Keyboard navigation support.

3. **Responsiveness**
   - Mobile-first layout.
   - Fluid grids and flexible images.
   - Breakpoints for small (≤640px), medium (641–1024px), and large screens (≥1025px).

*Application in UI*:
- Form fields highlight errors clearly.
- Buttons have sufficient touch targets (44×44px).
- Contrast ratios meet WCAG 2.1 AA standards.

## 3. Styling and Theming

**Approach & Tools**
- **Tailwind CSS** for utility-first styling.
- **Styled Components** (optional) for highly dynamic styles.
- **PostCSS** and **Autoprefixer** built into the build pipeline.

**Theming**
- A single `theme` object in `styles/theme.ts` defines colors, spacings, and font scales.
- Wrap the app in a `<ThemeProvider>` so components can access tokens via props or CSS variables.

**Visual Style**
- **Modern flat design** with subtle glassmorphism on modals and cards.
- Soft shadows and rounded corners (8px radius).

**Color Palette**
- Primary: #1E90FF (dodger blue)
- Secondary: #FF7F50 (coral)
- Background: #F5F7FA (light gray)
- Surface: #FFFFFF (white)
- Text: #333333 (dark gray)
- Border: #E2E8F0 (gray)

**Fonts**
- Headings: **Poppins**, sans-serif.
- Body: **Inter**, sans-serif.
- Fallbacks: Arial, Helvetica, sans-serif.

## 4. Component Structure

We follow an **atomic design** pattern:
- **Atoms**: Buttons, inputs, icons.
- **Molecules**: InputGroup (label + input), CardHeader.
- **Organisms**: Navbar, Sidebar, DataTable.
- **Templates/Pages**: Layouts that arrange organisms into full screens.

Benefits:
- Clear separation of concerns.
- Easy to spot and reuse small pieces.
- Components can be tested in isolation.

## 5. State Management

**Redux Toolkit**:
- `createSlice` for feature state (e.g., project requirements, floor plans).
- `RTK Query` for API data fetching and caching.

**Context API** (for simple UI state):
- Theme toggling (light/dark).
- Modal open/close handlers.

How It Works:
- Each slice lives in `store/` with actions and reducers.
- Components `useSelector` and `useDispatch` to read and update state.
- Global UI state (like snackbars) uses Context.

## 6. Routing and Navigation

**React Router v6**:
- A single `routes.tsx` file defines all routes and nested routes.
- **Lazy loading** with `React.lazy` and `Suspense` for page components.

Navigation Structure:
```
/                  → Dashboard
/requirements      → Requirements module
/floor-plan        → Floor-Plan Editor
/estimations       → Cost & Resource Estimation
/schedule          → Timeline & Gantt Charts
/materials         → Procurement & Inventory
/collaboration     → Communication Hub
/reports           → Analytics & Reports
/settings          → User & Project Settings
```

## 7. Performance Optimization

- **Code Splitting & Lazy Loading**: Each major page loads only when needed.
- **Tree Shaking** via ES modules to drop unused code.
- **Asset Optimization**:
  - Compress images (WebP).
  - SVG icons in an icon sprite.
- **Memoization**:
  - `React.memo` and `useMemo` for expensive renders.
- **Virtualized Lists** for large tables (e.g., react-window).

These measures reduce initial load time and improve runtime responsiveness.

## 8. Testing and Quality Assurance

**Unit & Integration Testing**
- **Jest** with **React Testing Library**.
- Test files co-located next to components (`Component.test.tsx`).
- Aim for 80%+ coverage on business logic and UI.

**End-to-End (E2E) Testing**
- **Cypress** for critical user flows (login, create project, export report).

**Linting & Formatting**
- **ESLint** (with TypeScript rules).
- **Prettier** for consistent code style.
- **Husky** + **Lint-Staged** to run checks before commits.

## 9. Conclusion and Overall Frontend Summary

This guideline lays out the **housebulding** frontend in everyday terms:
- A **React + TypeScript** foundation drives scalability and clarity.
- **Design principles** ensure a usable, accessible, and responsive UI.
- **Tailwind CSS** and theming keep our look consistent.
- **Atomic components** and **Redux Toolkit** make state and UI logic easy to maintain.
- **React Router**, code splitting, and memoization deliver smooth navigation and performance.
- **Robust testing** guarantees reliability as the app grows.

By following these guidelines, our frontend will stay organized, performant, and user friendly—perfectly aligned with our goal to guide users through every phase of the house-building journey.
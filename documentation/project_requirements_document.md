# Project Requirements Document (PRD)

## 1. Project Overview

**HouseBulding** is a web-based platform designed to guide residential construction projects from concept through completion. It brings together planning, design, budgeting, scheduling, procurement, and collaboration into a single unified environment. By centralizing these phases, the system reduces manual coordination, minimizes errors, and helps deliver houses on time and within budget.

We are building HouseBulding to solve the common challenges of scattered tools, siloed teams, and lack of transparency in construction projects. Success will be measured by how quickly a project team can set up a new build, generate accurate cost estimates, produce compliant floor plans, track progress against schedule, and communicate changes—all within one application.

## 2. In-Scope vs. Out-of-Scope

### In-Scope (Version 1)
- User registration and role-based authentication (owner, architect, contractor, client)
- Requirement capture module with customizable templates (site assessment, client wishlist)
- 2D floor-plan editor with drag-and-drop walls, doors, windows
- Automated material takeoff and cost estimation based on supplier price lists
- Basic scheduling engine that outputs a Gantt chart and milestone list
- Procurement dashboard for purchase orders and inventory level tracking
- Team collaboration hub with file sharing, comments, and version history
- Reporting dashboard with budget vs. actual and schedule adherence charts
- RESTful API endpoints for major modules and data export (CSV/JSON)

### Out-of-Scope (Later Phases)
- Full 3D modeling and real-time 3D rendering
- Advanced AI-driven optimization (e.g., predictive scheduling)
- Mobile-native apps (iOS/Android)
- Deep third-party integrations (accounting software, GIS, RFID hardware)
- Advanced analytics and business-intelligence tool exports
- Offline mode or on-site kiosk support

## 3. User Flow

A project lead (architect or general contractor) signs up with email and defines a new build project. They complete an initial requirement template, including site details and client preferences. Next, they invite team members—engineers, subcontractors, clients—assigning each a role and access level.

Once setup is complete, the architect opens the floor-plan editor to sketch rooms, walls, and openings. The system validates building code constraints in real time. After design approval, the estimator runs a cost estimation report that aggregates materials, labor, and equipment. A schedule is generated, shown as a Gantt chart, and purchase orders are created for critical materials. Throughout the project, team members share updates, attach photos or plans, and track budget and timeline on the dashboard.

## 4. Core Features

- **Authentication & Authorization**: Secure sign-up, login, password reset, and role-based access control.
- **Requirement Management**: Templates for site assessment, zoning rules, and client wishlists; customizable fields.
- **2D Floor-Plan Editor**: Drag-and-drop interface for walls, doors, windows; real-time validation against design rules.
- **Cost Estimation Module**: Automatic quantity takeoffs, supplier price list integration, labor/equipment cost factors, scenario comparison.
- **Scheduling Engine**: Task creation, dependency tracking, automatic timeline adjustments, Gantt chart export.
- **Procurement & Inventory**: Purchase order creation, supplier tracking, inventory threshold alerts, delivery log.
- **Collaboration Hub**: File uploads, comments, approvals, version history, role-based document control.
- **Reporting Dashboard**: Budget variance charts, schedule adherence graphs, export to CSV/JSON.
- **REST API**: Endpoints for projects, users, plans, estimates, schedules, procurement, and reports.

## 5. Tech Stack & Tools

- **Frontend**: React (with TypeScript) + Redux for state; CSS-in-JS (e.g., Styled Components)
- **Floor-Plan Editor**: Konva.js or Fabric.js for canvas interactions and real-time validation
- **Backend**: Node.js + Express (TypeScript); REST API
- **Database**: PostgreSQL for structured data; Prisma ORM
- **Authentication**: JSON Web Tokens (JWT) and bcrypt for password hashing
- **Hosting/Infrastructure**: Docker containers; AWS Elastic Beanstalk or Kubernetes
- **File Storage**: AWS S3 for user-uploaded documents and plans
- **Reports & Charts**: Chart.js or D3.js for dashboards
- **IDE & Plugins**: VS Code with ESLint, Prettier, and GitLens integrations

## 6. Non-Functional Requirements

- **Performance**: Page load times < 2 seconds; API responses < 300 ms under typical load
- **Scalability**: Design backend to scale horizontally via container orchestration
- **Security**: Enforce HTTPS; OWASP Top-10 protection; role-based access control; input validation and sanitization
- **Usability**: Intuitive UI with guided wizards; responsive layouts for desktop and tablets
- **Reliability**: 99.5% uptime; automated backups of database daily
- **Compliance**: GDPR-compliant data handling; optional export of user data

## 7. Constraints & Assumptions

- **Constraints**:
  - Must use stable open-source libraries (no experimental 3D engines in Phase 1)
  - Initial user base will be in one region—price lists are static CSV uploads
  - Hosting cost should stay within a small-medium budget tier on AWS

- **Assumptions**:
  - Users have modern browsers with canvas/WebGL support
  - Team members have reliable internet connections
  - Supplier price lists are provided in standard CSV or JSON format
  - No offline or mobile-only usage required initially

## 8. Known Issues & Potential Pitfalls

- **Canvas Performance**: Large floor plans may slow the editor. Mitigation: implement viewport culling and layer-based rendering.
- **Data Consistency**: Concurrent edits in the plan or schedule could overwrite changes. Mitigation: employ optimistic locking or simple edit locks per resource.
- **API Rate Limits**: If hosted on PaaS with rate caps, bulk exports may fail. Mitigation: batch endpoints and retry logic.
- **Schema Migrations**: Evolving cost-estimation rules could require DB changes. Mitigation: use migration tools (e.g., Prisma Migrate) and thorough testing.
- **User Training**: Non-technical users may struggle with the editor. Mitigation: include step-by-step tutorials and contextual help tooltips.


---

This PRD provides a clear, unambiguous reference for the HouseBulding platform’s initial version. All subsequent technical documents—architecture diagrams, frontend style guides, backend service definitions—should align with these requirements without assuming missing details.
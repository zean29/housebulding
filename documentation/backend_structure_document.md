# Backend Structure Document for HouseBuilding

This document outlines the backend architecture, hosting, and infrastructure for the HouseBuilding project. It is written in everyday language so anyone can understand how the backend is set up and why certain choices were made.

---

## 1. Backend Architecture

### Overview
- We use a **modular, service-oriented design**. Each major feature (like cost calculation or scheduling) lives in its own module or microservice.
- The core framework is **Node.js** with **Express.js** for handling HTTP requests.
- We follow the **Model-View-Controller (MVC)** pattern:  
  • Models represent data and business rules.  
  • Controllers handle incoming requests and coordinate models and services.  
  • Services contain reusable business logic (e.g., cost estimation algorithms).

### Why this design supports our goals
- **Scalability**: Services are stateless and can be scaled horizontally (spin up more instances when load grows).  
- **Maintainability**: Clear separation means teams can work on one feature without touching others.  
- **Performance**: Critical workloads (like generating PDFs or heavy calculations) can be offloaded to background workers.

---

## 2. Database Management

### Technologies used
- **Primary database**: PostgreSQL (relational SQL database).  
- **Cache layer**: Redis (in-memory store for improved response times).  
- **File storage**: Amazon S3 (for uploaded documents, images, 3D models).

### Data handling practices
- **Structured data** (projects, users, tasks) live in PostgreSQL tables.  
- **Frequently read data** (user sessions, rate-limiting counters) are cached in Redis.  
- **Backups and replication**: PostgreSQL is configured with automated daily backups and a read-replica for reporting queries.

---

## 3. Database Schema

Below is a high-level, human-readable overview. After that is a sample SQL schema for the main tables.

### Human-readable schema
- **Users**: who can log in (architects, contractors, clients).  
- **Projects**: each house-building engagement.  
- **Requirements**: functional and non-functional requirements for a project.  
- **FloorPlans**: design data for 2D/3D layouts.  
- **Estimates**: cost breakdowns tied to projects.  
- **Schedules**: tasks, Gantt chart entries, dependencies.  
- **Orders**: procurement orders for materials.  
- **Inventory**: on-site stock levels of materials.  
- **Messages** & **Documents**: collaboration artifacts.  
- **Reports**: generated analytics and dashboards.  
- **Roles & Permissions**: access control definitions.

### Sample SQL schema (PostgreSQL)
```sql
-- Users and Roles
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- e.g., "architect", "contractor"
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  owner_id INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Requirements
CREATE TABLE requirements (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  title VARCHAR(200) NOT NULL,
  type VARCHAR(50), -- "functional" or "non-functional"
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Floor Plans
CREATE TABLE floor_plans (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  layout_data JSONB NOT NULL, -- 2D/3D model data
  version INTEGER DEFAULT 1,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cost Estimates
CREATE TABLE estimates (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  total_cost NUMERIC(12,2) NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Schedule Tasks
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  title VARCHAR(200) NOT NULL,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  depends_on INTEGER REFERENCES tasks(id)
);

-- Procurement Orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  item_name VARCHAR(200) NOT NULL,
  quantity INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'ordered',
  expected_delivery DATE
);

-- Inventory
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  item_name VARCHAR(200) NOT NULL,
  quantity_on_hand INTEGER NOT NULL,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Messages & Documents
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  sender_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  uploader_id INTEGER REFERENCES users(id),
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  report_type VARCHAR(100),
  generated_at TIMESTAMP DEFAULT NOW(),
  data JSONB
);
```

---

## 4. API Design and Endpoints

### Style and approach
- We follow **RESTful principles**: clear resource URLs, HTTP verbs (GET/POST/PUT/DELETE), and standard status codes.  
- JSON is used for request and response bodies.  
- Authentication is handled via JWT tokens passed in the `Authorization` header.

### Key endpoints

| Endpoint                 | Method | Purpose                                      |
|--------------------------|--------|----------------------------------------------|
| /api/auth/signup         | POST   | Create a new user account                    |
| /api/auth/login          | POST   | User login, returns JWT                      |
| /api/users/{id}          | GET    | Retrieve user profile                        |
| /api/projects            | GET    | List all projects user has access to         |
| /api/projects            | POST   | Create a new project                         |
| /api/projects/{id}       | GET    | Get project details                          |
| /api/requirements        | POST   | Add a requirement to a project               |
| /api/floorplans          | PUT    | Save or update floor plan data               |
| /api/estimates           | POST   | Generate a cost estimate                     |
| /api/schedules           | POST   | Create tasks and dependencies                |
| /api/orders              | POST   | Place a materials procurement order          |
| /api/inventory           | GET    | Check current inventory                      |
| /api/messages            | POST   | Send a message in the project collaboration  |
| /api/documents           | POST   | Upload a document or drawing                 |
| /api/reports/generate    | POST   | Generate analytics or status report          |
| /api/integrations/{type} | POST   | Connect to third-party services              |

Each endpoint enforces **role-based access control**. For example, only a project owner or contractor can place orders.

---

## 5. Hosting Solutions

### Cloud provider
- **AWS** is our chosen environment. It offers reliable infrastructure and a broad set of managed services.

### Components
- **AWS Elastic Container Service (ECS)** or **Elastic Kubernetes Service (EKS)** to run backend services in Docker containers.  
- **Amazon RDS** for hosting PostgreSQL with automated backups and failover.  
- **Amazon ElastiCache (Redis)** for caching session data and frequently accessed queries.

### Benefits
- **Reliability**: AWS SLAs guarantee uptime and automatic failover.  
- **Scalability**: Easy to add more containers or database replicas under load.  
- **Cost-effectiveness**: Pay-as-you-go model, with options for reserved instances.

---

## 6. Infrastructure Components

- **Load Balancer (AWS ALB)**: Distributes incoming traffic across multiple service instances.  
- **Content Delivery Network (AWS CloudFront)**: Speeds up delivery of static assets (images, floor-plan files, documentation).  
- **Caching (Redis)**: Reduces database load for repeated queries (e.g., user sessions).  
- **Message Queue (AWS SQS or RabbitMQ)**: Handles background jobs (reports, notifications, PDF generation).  
- **CI/CD Pipeline**: GitHub Actions or AWS CodePipeline for automated builds, tests, and deployments.  
- **Secrets Management (AWS Secrets Manager)**: Securely store database credentials and API keys.

These components work together to ensure fast responses, high availability, and smooth user experience.

---

## 7. Security Measures

- **Transport Layer Security (TLS)**: All traffic is encrypted (HTTPS).  
- **Authentication**: JSON Web Tokens (JWT) for user sessions.  
- **Authorization**: Role-based access control (RBAC) checks on each endpoint.  
- **Data Encryption at Rest**: PostgreSQL volumes and S3 buckets are encrypted.  
- **Input Validation & Sanitization**: Prevent SQL injection and cross-site scripting (XSS).  
- **Rate Limiting**: Guard against brute-force and denial-of-service attacks.  
- **Regular Security Audits**: Automated vulnerability scans and dependency checks.

---

## 8. Monitoring and Maintenance

- **Logging**: Centralized via AWS CloudWatch and/or ELK Stack (Elasticsearch, Logstash, Kibana).  
- **Metrics & Alerts**: Prometheus and Grafana track throughput, error rates, CPU/memory usage. Notifications via email or Slack when thresholds are breached.  
- **Error Tracking**: Sentry captures unhandled exceptions and performance issues.  
- **Database Health**: Automated backups, routine vacuum and reindex operations for PostgreSQL.  
- **Patch Management**: Regular OS and dependency updates through the CI/CD pipeline.  
- **Disaster Recovery**: Periodic restore drills from backups to ensure data safety.

---

## 9. Conclusion and Overall Backend Summary

The HouseBuilding backend is built for **scalability**, **maintainability**, and **performance**. By using a service-oriented Node.js architecture, a reliable PostgreSQL data store, and AWS managed services, we achieve:
- Clear separation of concerns (modules for design, cost, schedule, procurement).  
- Fast responses through caching and load balancing.  
- Secure operations with encryption, authentication, and role checks.  
- Easy monitoring and maintenance with automated tools.

This setup aligns with our goal to support every phase of house-building projects—from initial requirements to final analytics—in a dependable, user-friendly way.
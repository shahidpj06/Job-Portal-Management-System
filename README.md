# JobNest — Job Portal Management System

**JobNest** is a production-ready, full-stack Job Portal Management System built for both **candidates and administrators**.

The platform provides end-to-end job management and application workflows, including secure authentication, job discovery, application tracking, resume uploads, administrative analytics, and applicant management.

The project is built as a TypeScript monorepo using **React 19, Node.js, Express 5, PostgreSQL, Prisma ORM, Redux Toolkit, and Supabase**.

---

#### Home Desktop View

<img width="1470" height="886" alt="image" src="https://github.com/user-attachments/assets/1c5eccfd-01af-4675-a965-1e38f48a6f59" />
<img width="1470" height="886" alt="image" src="https://github.com/user-attachments/assets/babca793-7443-4955-97ac-366917f1279c" />
<img width="1470" height="886" alt="image" src="https://github.com/user-attachments/assets/f7e38195-2315-44ea-91c1-1bfd40769817" />
<img width="1470" height="886" alt="image" src="https://github.com/user-attachments/assets/e2fde50d-4c9e-43f4-86bb-6cdc2f9a0e32" />
<img width="1470" height="886" alt="image" src="https://github.com/user-attachments/assets/d1f46b17-36de-4e1e-a8f7-a1ddd7aad1db" />

#### Job Discovery View

<img width="1470" height="886" alt="image" src="https://github.com/user-attachments/assets/fc7ad757-85bb-4ad7-b322-8a97a865f619" />
<img width="1470" height="886" alt="image" src="https://github.com/user-attachments/assets/bb7dee96-3be5-4501-a58f-4101696ef03d" />

#### Job Deatil View

<img width="1470" height="886" alt="image" src="https://github.com/user-attachments/assets/63cd0579-e205-4f39-a1b9-c18c7fed0be4" />
<img width="1470" height="886" alt="image" src="https://github.com/user-attachments/assets/915a36ef-b49f-41e7-b79a-943af388949c" />

---

## ✨ Key Features

### 👤 Candidate Portal

* Secure registration, login, logout, and password recovery
* Browse and search available job opportunities
* Filter jobs by:
  * Category
  * Experience level
  * Employment type
* View detailed job descriptions and requirements
* Apply for jobs with resume upload
* Track submitted applications
* Manage candidate profile and avatar
* Responsive experience across desktop and mobile devices

### 🛡️ Admin Portal

* Role-protected admin dashboard
* Dashboard analytics and platform statistics
* Create, view, update, and delete jobs
* Manage jobs with pagination and filtering
* Review candidates and submitted applications
* Update applicant/application statuses
* Manage job-related administrative workflows

### 🔐 Authentication & Security

* JWT access and refresh token authentication
* Refresh token rotation
* HTTP-only cookie support
* Role-based authorization
* Password hashing with bcrypt
* Request rate limiting
* Zod-based request validation
* Protected frontend routes
* Centralized backend error handling

---

## 🛠️ Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* Redux Toolkit
* React Router
* React Hook Form
* Zod
* Tailwind CSS
* shadcn/ui
* Lucide React
* Sonner
* Axios

### Backend

* Node.js
* Express.js 5
* TypeScript
* Prisma ORM 7
* PostgreSQL
* JWT
* bcrypt
* Zod

### Storage & External Services

* **Supabase Storage** — resumes, profile avatars, and company logos
* **Resend** — transactional emails and password-reset communication

### Development Tooling

* pnpm Workspaces
* concurrently
* ESLint
* Prettier
* Prisma migrations and seed scripts

---

## 🏗️ Architecture

JobNest follows a monorepo architecture with the frontend and backend maintained as separate applications.

```text
                    ┌─────────────────────┐
                    │   React Web Client  │
                    │   React + Redux     │
                    └──────────┬──────────┘
                               │
                          REST API
                               │
                    ┌──────────▼──────────┐
                    │   Express Server    │
                    │  Auth / Validation  │
                    │   Business Logic    │
                    └──────┬────────┬─────┘
                           │        │
                 ┌─────────▼───┐  ┌─▼──────────────┐
                 │ PostgreSQL  │  │ External       │
                 │   Prisma    │  │ Services       │
                 └─────────────┘  │ Supabase       │
                                  │ Resend         │
                                  └────────────────┘
```

---

## 🌟 Evaluation Criteria

| Evaluation Criterion          | Implementation                                                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Full-Stack Implementation** | Monorepo architecture containing `@jobnest/web` with React 19 + Vite and `@jobnest/server` with Node.js + Express 5            |
| **State Management**          | Centralized Redux Toolkit store for authentication, jobs, filters, applications, and administrative workflows                  |
| **Authentication & Security** | JWT access/refresh tokens, token rotation, HTTP-only cookies, bcrypt password hashing, authorization guards, and rate limiting |
| **Database & Migrations**     | PostgreSQL with Prisma ORM, relational models, versioned migrations, and deterministic database seeding                        |
| **Admin Portal**              | Analytics dashboard, job CRUD operations, applicant management, filtering, and pagination                                      |
| **Candidate Portal**          | Job discovery, multi-criteria filtering, job details, profile management, resume upload, and application submission            |
| **Validation**                | Shared validation principles using Zod and React Hook Form                                                                     |
| **Code Quality**              | TypeScript across the stack, modular architecture, ESLint, Prettier, reusable components, and separation of concerns           |
| **User Experience**           | Responsive Tailwind CSS UI, shadcn/ui components, accessible primitives, loading/error states, and toast notifications         |

---

## 📁 Repository Structure

```text
Job-Portal-Management-System/
│
├── apps/
│   │
│   ├── server/                         # Express backend
│   │   ├── prisma/
│   │   │   ├── migrations/             # Database migration history
│   │   │   ├── schema.prisma           # Database models and relations
│   │   │   └── seed.ts                 # Database seed script
│   │   │
│   │   ├── src/
│   │   │   ├── apis/                   # API routes
│   │   │   ├── middlewares/            # Authentication, authorization,
│   │   │   │                           # rate limiting and error handling
│   │   │   ├── services/               # Business logic and integrations
│   │   │   └── server.ts               # Express application entry point
│   │   │
│   │   └── package.json
│   │
│   └── web/                            # React frontend
│       ├── src/
│       │   ├── components/             # Reusable UI components
│       │   ├── providers/              # Application providers
│       │   ├── routes/                 # Public and protected routes
│       │   ├── services/               # Redux slices and API client
│       │   └── views/                  # Candidate and admin pages
│       │
│       └── package.json
│
├── package.json                        # Workspace scripts
├── pnpm-workspace.yaml                 # pnpm workspace configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

* **Node.js** `>= 20`
* **pnpm** `>= 9`
* **PostgreSQL**

A local PostgreSQL instance can be used, or a hosted PostgreSQL provider such as Supabase or Neon.

Install pnpm globally if required:

```bash
npm install -g pnpm
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/shahidpj06/Job-Portal-Management-System.git
cd Job-Portal-Management-System
```

---

## 2. Install Dependencies

Install dependencies for all workspace applications:

```bash
pnpm install
```

---

## 3. Configure Environment Variables

Copy the provided environment templates.

### Backend

```bash
cp apps/server/.env.example apps/server/.env
```

### Frontend

```bash
cp apps/web/.env.example apps/web/.env
```

Update the generated `.env` files with the required credentials and configuration.

For the backend, make sure your PostgreSQL connection variables are configured correctly:

```env
DATABASE_URL="your-database-url"
DIRECT_URL="your-direct-database-url"
```

Additional credentials may be required for services such as:

* Supabase
* Resend
* JWT authentication

Refer to the `.env.example` files for the complete list of required variables.

---

## 4. Run Database Migrations

Apply the existing Prisma migrations:

```bash
pnpm --filter @jobnest/server exec prisma migrate deploy
```

This creates the required database tables and relationships.

---

## 5. Seed the Database

Populate the database with initial development data:

```bash
pnpm --filter @jobnest/server exec tsx prisma/seed.ts
```

The seed script can populate data such as:

* Users
* Companies
* Job categories
* Jobs
* Application-related test data

---

## 6. Start the Development Environment

Start both the frontend and backend applications:

```bash
pnpm dev
```

The applications will be available at:

| Service     | Address                        |
| ----------- | ------------------------------ |
| Frontend    | `http://localhost:5173`        |
| Backend API | `http://localhost:4000/api/v1` |

---

## 🔄 Application Flow

### Candidate

```text
Register / Login
      ↓
Browse Jobs
      ↓
Search & Filter
      ↓
View Job Details
      ↓
Apply for Job
      ↓
Upload Resume
      ↓
Track Application
```

### Administrator

```text
Admin Login
      ↓
Dashboard
      ↓
Manage Jobs
      ↓
Review Applications
      ↓
Review Candidates
      ↓
Update Application Status
```

---

## 🔒 Role-Based Access Control

JobNest separates application functionality between candidate and administrator roles.

| Capability                | Candidate | Admin |
| ------------------------- | :-------: | :---: |
| Browse Jobs               |     ✅     |   ✅   |
| View Job Details          |     ✅     |   ✅   |
| Apply for Jobs            |     ✅     |   —   |
| Manage Profile            |     ✅     |   —   |
| Track Applications        |     ✅     |   —   |
| Access Admin Dashboard    |     —     |   ✅   |
| Create Jobs               |     —     |   ✅   |
| Edit Jobs                 |     —     |   ✅   |
| Delete Jobs               |     —     |   ✅   |
| Review Applicants         |     —     |   ✅   |
| Update Application Status |     —     |   ✅   |

Authorization is enforced on the backend rather than relying only on frontend route protection.

---

## 🗄️ Database

The application uses **PostgreSQL** with **Prisma ORM** for database access and schema management.

Prisma provides:

* Type-safe database queries
* Relational data modelling
* Database migrations
* Schema versioning
* Development seeding

To inspect the database using Prisma Studio:

```bash
pnpm --filter @jobnest/server exec prisma studio
```

---

## 📦 File Storage

JobNest uses **Supabase Storage** for uploaded assets such as:

```text
Resumes
Profile Avatars
Company Logos
```

Uploaded files are stored externally while their corresponding references are maintained by the application.

---

## 📧 Email Service

Transactional email functionality is handled through **Resend**.

It is used for workflows such as:

* Password reset requests
* Password recovery communication
* Other transactional notifications

---

## 🧹 Code Quality

The project emphasizes maintainability and consistent coding standards through:

* TypeScript across frontend and backend
* Modular application structure
* Reusable React components
* Separation of routes, middleware, services, and views
* Schema-based validation with Zod
* Centralized state management
* ESLint
* Prettier
* Consistent error handling
* Environment-based configuration

---

## 📜 Available Scripts

From the project root:

```bash
# Start frontend and backend in development mode
pnpm dev

# Install workspace dependencies
pnpm install

# Apply production/database migrations
pnpm --filter @jobnest/server exec prisma migrate deploy

# Seed the database
pnpm --filter @jobnest/server exec tsx prisma/seed.ts

# Open Prisma Studio
pnpm --filter @jobnest/server exec prisma studio
```

Additional application-specific scripts are available inside the respective `package.json` files.

---

## 📄 License

This project is developed as a full-stack Job Portal Management System for technical assessment and demonstration purposes.

---

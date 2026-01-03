# DeadStock Management Portal

A full-stack web application for managing and tracking deadstock inventory for the Computer Engineering Department at SPIT. Built with FastAPI backend, Next.js frontend, MySQL database, and Supabase authentication.

**Live Demo:** [Click Here !!](https://deadstock-management-portal.onrender.com)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** - Supabase-powered authentication with SPIT email validation (@spit.ac.in)
- 📦 **Asset Management** - Complete CRUD operations for managing deadstock assets
- 👥 **Assignment Tracking** - Track asset assignments to teachers with location and date management
- 🗑️ **Scrap Management** - Multi-phase scrap workflow (Identified → Committee Review → Principal Approval → Final Action)
- 📊 **Dashboard Analytics** - Real-time statistics and insights on inventory status
- 📄 **Comprehensive Reports** - Generate detailed reports with filters and export capabilities
- 🏷️ **Master Data Management** - Manage labs, vendors, categories, teachers, and scrap phases
- 💾 **Backup & Restore** - Database backup and restoration functionality
- 🔍 **Advanced Filtering** - Filter assets by category, lab, vendor, status, and financial year

### User Experience
- 📱 **Fully Responsive** - Mobile-first design with optimized layouts for all devices
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS and shadcn/ui components
- 🌙 **Enhanced Accessibility** - Password visibility toggle, form validation, and user-friendly error messages
- ⚡ **Real-time Updates** - Live inventory status tracking
- 🎯 **Collapsible Sidebar** - Desktop navigation with collapse/expand functionality
- 📲 **Mobile Menu** - Touch-friendly overlay menu for mobile devices

---

## 🛠 Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.11.9)
- **Database:** MySQL with PyMySQL connector
- **ORM:** SQLAlchemy 2.x
- **Validation:** Pydantic V2
- **CORS:** FastAPI middleware for cross-origin requests
- **Authentication:** Token-based authentication ready (JWT support)

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Authentication:** Supabase Auth with email validation
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Notifications:** Sonner (toast notifications)
- **Linting:** ESLint

### DevOps & Deployment
- **Hosting:** Render (Backend & Frontend)
- **Database:** MySQL (Cloud or Local)
- **Version Control:** Git & GitHub

---

## 📁 Project Structure

```
DeadStock-Management-Portal/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py              # Dependency injection
│   │   │   └── v1/
│   │   │       ├── __init__.py      # API router aggregation
│   │   │       ├── assets.py        # Asset CRUD endpoints
│   │   │       ├── assignments.py   # Assignment management
│   │   │       ├── backup.py        # Backup & restore
│   │   │       ├── filters.py       # Filter endpoints
│   │   │       ├── masters.py       # Master data management
│   │   │       ├── reports.py       # Reporting endpoints
│   │   │       └── scrap.py         # Scrap management
│   │   ├── core/
│   │   │   ├── config.py            # Environment configuration
│   │   │   └── database.py          # Database connection & session
│   │   ├── models/                  # SQLAlchemy ORM models
│   │   │   ├── __init__.py
│   │   │   ├── asset.py
│   │   │   ├── assignment.py
│   │   │   ├── category.py
│   │   │   ├── lab.py
│   │   │   ├── scrap.py
│   │   │   ├── scrap_phase.py
│   │   │   ├── teacher.py
│   │   │   └── vendor.py
│   │   ├── schemas/                 # Pydantic validation schemas
│   │   ├── services/                # Business logic layer
│   │   ├── utils/
│   │   │   └── financial_year.py    # FY calculation utilities
│   │   └── main.py                  # FastAPI application entry
│   ├── . env                         # Environment variables
│   ├── .gitignore
│   ├── requirements.txt             # Python dependencies
│   ├── runtime.txt                  # Python version (3.11.9)
│   ├── seed_data.py                 # Database seeding script
│   ├── start.bat                    # Windows startup script
│   └── start. sh                     # Unix startup script
│
├── frontend/
│   ├── app/
│   │   ├── assignments/             # Assignment management page
│   │   ├── assets/                  # Asset management page
│   │   ├── backup/                  # Backup page
│   │   ├── login/
│   │   │   └── page.tsx             # Login page with auth
│   │   ├── masters/                 # Master data page
│   │   ├── reports/                 # Reports page
│   │   ├── scrap/                   # Scrap management page
│   │   ├── signup/
│   │   │   └── page.tsx             # Signup page with validation
│   │   ├── teachers/                # Teacher management page
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Main dashboard with sidebar
│   │   ├── providers. tsx            # App providers
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── pages/
│   │   │   └── DashboardView.tsx    # Dashboard component
│   │   └── ui/                      # shadcn/ui components
│   ├── hooks/                       # Custom React hooks
│   ├── lib/
│   │   ├── api. ts                   # Axios API client
│   │   ├── supabase/
│   │   │   └── client.ts            # Supabase client setup
│   │   └── utils.ts                 # Utility functions
│   ├── public/
│   │   └── image.png                # SPIT CE logo
│   ├── . env. local                   # Local environment variables
│   ├── . env.example                 # Environment template
│   ├── . eslintrc.json               # ESLint configuration
│   ├── middleware.ts                # Next.js middleware
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── package.json                 # Node dependencies
│   ├── start.bat                    # Windows startup script
│   └── start.sh                     # Unix startup script
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python:** 3.11.9 or higher
- **Node.js:** 16+ (with npm or yarn)
- **MySQL:** 8.0+ or MariaDB 10.3+ (installed and running)
- **Git:** For version control
- **Supabase Account:** For authentication ([supabase.com](https://supabase.com))

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/heetsz/DeadStock-Management-Portal.git
   cd DeadStock-Management-Portal/backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up MySQL database:**
   ```bash
   # Login to MySQL
   mysql -u root -p

   # Create database
   CREATE DATABASE deadstock CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;
   ```

5. **Configure environment variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL=mysql+pymysql://username:password@localhost: 3306/deadstock
   SECRET_KEY=your-secret-key-change-in-production-use-openssl-rand-hex-32
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   FRONTEND_ORIGINS=http://localhost:3000,http://localhost:3001
   ```
   
   **Important:** Replace `username` and `password` with your MySQL credentials. 

6. **Initialize the database:**
   The database tables will be created automatically when you start the application.  To seed with sample data:
   ```bash
   python seed_data.py
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Supabase:**
   - Create a project at [supabase.com](https://supabase.com)
   - Go to Project Settings → API
   - Copy the Project URL and anon/public key

4. **Configure environment variables:**
   Create a `.env. local` file in the `frontend/` directory:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. **Configure Supabase Email Validation:**
   - Go to Authentication → Providers → Email
   - Enable email provider
   - Optionally configure email templates for confirmation

---

## ▶️ Running the Application

### Backend

**Linux/macOS:**
```bash
cd backend
chmod +x start.sh
./start.sh
```

**Windows:**
```bash
cd backend
start.bat
```

**Manual start:**
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

### Frontend

**Linux/macOS:**
```bash
cd frontend
chmod +x start.sh
./start.sh
```

**Windows:**
```bash
cd frontend
start.bat
```

**Manual start:**
```bash
cd frontend
npm run dev
```

The frontend application will be available at `http://localhost:3000`

---

## 🔐 Environment Variables

### Backend `.env`
```env
# MySQL Database Connection
# Format: mysql+pymysql://username:password@host:port/database_name
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/deadstock

# JWT Authentication
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Origins (comma-separated)
FRONTEND_ORIGINS=http://localhost:3000,http://localhost:3001,https://your-production-url.com
```

### Frontend `.env.local`
```env
# Backend API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project. supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Production Notes:**
- For Render deployment, set environment variables in the Render Dashboard
- Only `NEXT_PUBLIC_*` variables are exposed to the browser
- Never commit `.env` or `.env.local` files to version control
- Use strong, randomly generated values for `SECRET_KEY` in production

---

## 🔐 Authentication

The application uses **Supabase Authentication** with the following features:

### Features
- ✅ Email/Password authentication
- ✅ Email validation (requires @spit.ac.in domain)
- ✅ Password visibility toggle
- ✅ Session management
- ✅ Protected routes
- ✅ Auto-redirect on authentication status

### User Flow
1. **Sign Up:** Users register with their @spit.ac.in email
2. **Email Confirmation:** Supabase sends a confirmation email
3. **Sign In:** Users log in with confirmed credentials
4. **Session Management:** JWT tokens manage user sessions
5. **Protected Access:** Unauthenticated users are redirected to login

### Authentication Pages
- **Login:** `/login` - Sign in with SPIT email
- **Sign Up:** `/signup` - Register new account with validation
- **Main App:** `/` - Protected dashboard (requires authentication)

---

## 📚 API Documentation

The backend provides a RESTful API with the following endpoints: 

### Base URL
- **Local:** `http://localhost:8000/api/v1`
- **Production:** `https://your-backend. onrender.com/api/v1`

### API Groups

#### 🔧 Assets (`/assets`)
- `GET /assets` - List all assets with filters
- `POST /assets` - Create new asset
- `GET /assets/{id}` - Get asset details
- `PUT /assets/{id}` - Update asset
- `DELETE /assets/{id}` - Delete asset

#### 📋 Assignments (`/assignments`)
- `GET /assignments` - List assignments
- `POST /assignments` - Create assignment
- `PUT /assignments/{id}` - Update assignment
- `DELETE /assignments/{id}` - Delete assignment

#### 🗑️ Scrap (`/scrap`)
- `GET /scrap` - List scrap entries with phase filtering
- `POST /scrap` - Create scrap entry
- `PUT /scrap/{id}` - Update scrap status/phase

#### 🏷️ Masters (`/masters`)
- Labs:  `/masters/labs`
- Vendors: `/masters/vendors`
- Categories: `/masters/categories`
- Teachers: `/masters/teachers`
- Scrap Phases: `/masters/scrap-phases`

#### 📊 Reports (`/reports`)
- Asset reports with various filters
- Export functionality

#### 💾 Backup (`/backup`)
- `POST /backup/create` - Create database backup
- `POST /backup/restore` - Restore from backup

### Interactive Documentation
Visit `http://localhost:8000/docs` for interactive Swagger UI documentation with request/response examples.

---

## 🗄️ Database Schema

### Key Tables

#### `asset`
Stores deadstock asset information
- `asset_id` (PK, UUID)
- `asset_name`, `description`, `quantity`, `unit_price`, `total_cost`
- `purchase_date`, `financial_year`
- `category_id` (FK → category)
- `vendor_id` (FK → vendor)
- `lab_id` (FK → lab)
- `status` (ACTIVE, ASSIGNED, SCRAPPED, UNDER_MAINTENANCE)
- `condition`, `location`, `remarks`

#### `asset_assignment`
Tracks asset assignments to teachers
- `assignment_id` (PK, UUID)
- `asset_id` (FK → asset)
- `teacher_id` (FK → teacher)
- `assigned_quantity`, `assignment_date`, `return_date`
- `current_location`, `remarks`

#### `scrap`
Manages scrap workflow
- `scrap_id` (PK, UUID)
- `asset_id` (FK → asset)
- `phase_id` (FK → scrap_phase)
- `quantity`, `initiated_date`, `completion_date`
- `reason`, `remarks`, `status`

#### `category`, `lab`, `vendor`, `teacher`, `scrap_phase`
Master data tables with UUID primary keys

### Financial Year Calculation
Financial Year runs from **1 March to 28/29 February**: 
- Purchase date **March-December**:  FY = Year to Year+1
- Purchase date **January-February**: FY = Year-1 to Year

Example:  Asset purchased on 15-Mar-2024 → FY:  2024-2025

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Credits

Developed for the **Computer Engineering Department, SPIT (Sardar Patel Institute of Technology)**

**Contributors:**
- [Heet Shah (@heetsz)](https://github.com/heetsz)
- [Shivsharan (@ShivsharanSanjawad)](https://github.com/shivsharansanjawad)
- [Jovan (@jovan-05)](https://github.com/jovan-05)

---

## 📞 Support

For issues, questions, or contributions: 
- **GitHub Issues:** [Create an issue](https://github.com/heetsz/DeadStock-Management-Portal/issues)
- **Live Demo:** [https://deadstock-management-portal.onrender.com](https://deadstock-management-portal.onrender. com)

---

**Hosted on:** [Render](https://render.com)  
**© 2026 SPIT Computer Engineering.  All rights reserved.**

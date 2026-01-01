# DeadStock Management Portal

A full-stack web application for managing and tracking dead stock inventory. Built with modern technologies for both frontend and backend.

**Live Demo:**  
- [Render](https://deadstock-management-portal.onrender.com)
- [Vercel](https://dead-stock-management-portal-main-ir1g-3h7ozdl1o.vercel.app)

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
- [Project Structure Details](#project-structure-details)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Inventory Management** - Track and manage dead stock items
- **Real-time Updates** - Live inventory status tracking
- **User-friendly Interface** - Intuitive UI built with modern web technologies
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Data Persistence** - Reliable backend with database integration

## 🛠 Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.11.9)
- **Runtime:** Python 3.11.9
- **Database:** MySQL
- **ORM:** SQLAlchemy
- **Dependencies:** See `backend/requirements.txt`

### Frontend
- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Configured with `components.json`
- **Linting:** ESLint

## 📁 Project Structure

```
DeadStock-Management-Portal/
├── backend/
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Core configuration
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   ├── main.py        # Application entry point
│   │   └── __init__.py
│   ├── .env               # Environment variables
│   ├── .gitignore
│   ├── requirements.txt   # Python dependencies
│   ├── runtime.txt        # Python version
│   ├── seed_data.py       # Database seeding script
│   ├── start.bat          # Windows startup script
│   └── start.sh           # Unix startup script
│
├── frontend/
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── public/            # Static assets
│   ├── .env               # Environment variables
│   ├── .eslintrc.json     # ESLint configuration
│   ├── next.config.js     # Next.js configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── tsconfig.json      # TypeScript configuration
│   ├── package.json       # Node dependencies
│   ├── start.bat          # Windows startup script
│   └── start.sh           # Unix startup script
│
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- **Backend:** Python 3.11.9
- **Database:** MySQL 8.0+ or MariaDB 10.3+ (installed and running)
- **Frontend:** Node.js 16+ and npm/yarn
- **Git:** For version control

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up MySQL database:
   ```bash
   # Using MySQL command line
   mysql -u root -p
   CREATE DATABASE deadstock CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   # Or using command:
   # mysql -u root -p -e "CREATE DATABASE deadstock CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

4. Create a `.env` file in the backend directory with your configuration:
   ```
   DATABASE_URL=mysql+pymysql://username:password@localhost:3306/deadstock
   SECRET_KEY=your-secret-key-change-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   FRONTEND_ORIGINS=http://localhost:3000,http://localhost:3001
   ```
   Replace `username`, `password`, and `localhost:3306` with your MySQL credentials.

5. Seed the database (optional):
   ```bash
   python seed_data.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file with your API configuration:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

## ▶️ Running the Application

### Backend

**Linux/macOS:**
```bash
cd backend
./start.sh
```

**Windows:**
```bash
cd backend
start.bat
```

The backend API will be available at `http://localhost:8000`

### Frontend

**Linux/macOS:**
```bash
cd frontend
./start.sh
```

**Windows:**
```bash
cd frontend
start.bat
```

The frontend application will be available at `http://localhost:3000`

### Development Commands

**Backend:**
```bash
# Run with auto-reload
uvicorn app.main:app --reload

# Run on specific port
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🔐 Environment Variables

### Backend (`.env`)
```
# MySQL connection string
# Format: mysql+pymysql://username:password@host:port/database_name
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/deadstock
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Frontend (`.env.local`)
Create a `.env.local` file in the `frontend` directory:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

**Important Notes:**
- For local development: Create `frontend/.env.local` with the above content
- For production (Render): Set `NEXT_PUBLIC_API_BASE_URL` in Render Dashboard → Frontend Service → Settings → Environment
- Only variables starting with `NEXT_PUBLIC_` are accessible in the browser
- After adding environment variables in Render, you must redeploy the service
- See `frontend/.env.example` for reference

## 📚 Project Structure Details

### Backend Architecture
- **api/** - RESTful API endpoints and routes
- **core/** - Configuration, security, and core utilities
- **models/** - SQLAlchemy ORM models
- **schemas/** - Pydantic request/response schemas
- **services/** - Business logic and database operations
- **utils/** - Helper functions and utilities

### Frontend Architecture
- **app/** - Next.js 13+ app directory with pages and layouts
- **components/** - Reusable React components
- **hooks/** - Custom React hooks for state management
- **lib/** - Utility functions and API client helpers
- **public/** - Static assets (images, icons, etc.)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Hosted on:** [Render](https://render.com)  
**Live Link:** https://deadstock-management-portal.onrender.com

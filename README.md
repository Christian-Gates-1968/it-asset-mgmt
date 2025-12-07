# 🏭 IT Asset Management System - IOCL

A comprehensive full-stack web application for managing IT assets, complaints, call logs, and maintenance reports. Built during an internship at Indian Oil Corporation Limited (IOCL).

## 🚀 Features

### 📦 Asset Management
- ✅ Full CRUD operations for IT assets
- 📊 Bulk upload via Excel templates
- 🔍 Advanced filtering (Category, Status, Date range)
- 📄 Pagination (5 assets per page)
- 🎴 Table & Card view modes
- 🏢 Department-based asset tracking

### 🛠️ Complaint Management
- 📝 Create and track asset complaints
- 👷 Engineer assignment system
- 🚦 Priority levels (Low, Medium, High, Critical)
- 📈 Status tracking (Open, In Progress, Resolved)
- 🔔 Real-time updates

### 📞 Call Logging
- 📲 Support ticket tracking (Phone, Email, Walk-in)
- ⏱️ Response time monitoring
- 📊 Call analytics

### 📋 PM Reports
- 📤 Upload preventive maintenance reports (.xls, .xlsx)
- 💾 Download and delete functionality
- 🔗 Asset linking

### 📊 Analytics Dashboard
- 📈 Engineer performance metrics
- 📉 Monthly complaint trends
- 🥧 Category distribution charts
- 🔢 Real-time statistics

### 🔐 Security & Access Control
- 🔑 Role-based authentication (Admin/Engineer)
- 🏢 Department-based data isolation
- 💾 Session persistence across page refreshes
- 🌓 Dark mode support

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18.3, TypeScript 5.8, Vite 5.4, Tailwind CSS 3.4 |
| **Backend** | Node.js 22.13, Express 5.1 |
| **Database** | MySQL 8.0 |
| **Libraries** | Axios, React Router, Recharts, XLSX, Lucide Icons, React Toastify |
| **DevOps** | Docker, Docker Compose |

## 📋 Prerequisites

Choose **ONE** of the following setup methods:

### Option A: Docker (Recommended) 🐳
- Docker Desktop
- Git

### Option B: Manual Setup
- Node.js v22 or higher
- MySQL Server 8.0
- Git

## 🚀 Quick Start

### Option A: Docker Setup (Recommended) 🐳

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/iocl-asset-management.git
   cd iocl-asset-management
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: `http://localhost:5000`
   - Backend API: `http://localhost:5000/api`
   - MySQL: `localhost:3306`

4. **Stop the application**
   ```bash
   docker-compose down
   ```

**That's it!** Docker will automatically:
- ✅ Set up MySQL database with schema
- ✅ Build and run the backend
- ✅ Serve the frontend
- ✅ Configure all connections

---

### Option B: Manual Setup

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/iocl-asset-management.git
cd iocl-asset-management
```

#### 2. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Run the setup script
source backend/setup.sql

# Or manually
CREATE DATABASE it_asset_mgmt;
USE it_asset_mgmt;
SOURCE backend/setup.sql;
```

#### 3. Backend Setup
```bash
cd backend
npm install
node index.js
```
Backend runs on `http://localhost:5000`

#### 4. Frontend Setup (New Terminal)
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

#### 5. Configure Database Connection
Update `backend/db.js` with your MySQL credentials:
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password',  // Change this
  database: 'it_asset_mgmt',
});
```

## 🔑 Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin1 | admin123 |
| Admin | admin2 | admin123 |
| Engineer | eng1 | eng123 |
| Engineer | eng3 | eng123 |

**Note:** Change these credentials in production!

## 📸 Screenshots

### Login Page
Beautiful glassmorphism login with role toggle (Admin/Engineer)

### Dashboard
Real-time statistics, recent activity, and analytics

### Asset Management
- Table/Card view toggle
- Bulk upload with Excel templates
- Advanced filtering and pagination

### Analytics
- Engineer performance charts
- Monthly complaint trends
- Category distribution

## 🏗️ System Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │ ◄─────► │   Backend   │ ◄─────► │    MySQL    │
│ React + TS  │  REST   │  Express.js │  Pool   │   Database  │
│   Port:5173 │   API   │  Port:5000  │         │  Port:3306  │
└─────────────┘         └─────────────┘         └─────────────┘
```

## 📁 Project Structure

```
iocl-asset-management/
├── backend/
│   ├── routes/
│   │   ├── assets.js           # Asset CRUD + bulk upload
│   │   ├── complaints.js       # Complaint management
│   │   ├── call-logs.js        # Call logging
│   │   └── pm-reports.js       # PM report file handling
│   ├── uploads/
│   │   └── pm-reports/         # Uploaded files storage
│   ├── db.js                   # MySQL connection pool
│   ├── index.js                # Express server entry
│   ├── setup.sql               # Database schema + seed data
│   └── package.json
│
├── client/
│   ├── public/
│   │   └── templates/
│   │       └── bulk_asset_template.xlsx
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout/
│   │   │       ├── DashboardLayout.tsx
│   │   │       ├── Header.tsx
│   │   │       └── Sidebar.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx      # Authentication state
│   │   │   ├── DataContext.tsx      # Data refresh trigger
│   │   │   └── ThemeContext.tsx     # Dark mode
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AssetManagement.tsx
│   │   │   ├── ComplaintManagement.tsx
│   │   │   ├── CallLogging.tsx
│   │   │   ├── PMReportUpload.tsx
│   │   │   └── Reports.tsx           # Analytics
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── Dockerfile                 # Multi-stage build
├── docker-compose.yml         # Full stack orchestration
├── .dockerignore
└── README.md
```

## 🗄️ Database Schema

```sql
- departments (5 departments: IT, Finance, LPG, HR, Operations)
- users (Admins + 92 Engineers with bcrypt hashed passwords)
- assets (IT equipment with dept_id, warranty, AMC tracking)
- complaints (Status, Priority, Engineer assignment, Timestamps)
- call_logs (Support tickets with response tracking)
- pm_reports (File metadata with asset linking)
```

## 🔧 API Endpoints

### Authentication
- `POST /api/login` - User authentication

### Assets
- `GET /api/assets` - Get all assets (with dept filtering)
- `POST /api/assets` - Create new asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset
- `POST /api/assets/bulk-upload` - Bulk import from Excel

### Complaints
- `GET /api/complaints` - Get complaints (dept filtered)
- `POST /api/complaints` - Create complaint
- `PUT /api/complaints/:id` - Update complaint (assign engineer)
- `DELETE /api/complaints/:id` - Delete complaint

### Call Logs
- `GET /api/call-logs` - Get all call logs
- `POST /api/call-logs` - Log new call
- `PUT /api/call-logs/:id` - Update call log
- `DELETE /api/call-logs/:id` - Delete call log

### PM Reports
- `GET /api/pm-reports` - Get reports list
- `POST /api/pm-reports` - Upload report file
- `GET /api/pm-reports/download/:id` - Download file
- `DELETE /api/pm-reports/:id` - Delete report

### Analytics
- `GET /api/users` - Get all users (for engineer list)

## 📦 Bulk Asset Upload

Download the Excel template from `/templates/bulk_asset_template.xlsx`

**Required columns:**
- Asset Name
- Category
- Serial Number
- Status
- Department
- Location
- Purchase Date (YYYY-MM-DD)
- Warranty Expiry (YYYY-MM-DD)
- AMC/Warranty
- Inventory (number)
- Vendor Name

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Access MySQL shell
docker exec -it iocl_mysql mysql -u root -pkrish it_asset_mgmt

# Access backend container
docker exec -it iocl_backend sh
```

## 🚀 Deployment

### Production Checklist
- [ ] Change default passwords in `backend/setup.sql`
- [ ] Update MySQL credentials in `backend/db.js`
- [ ] Add `.env` file for sensitive data
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Implement rate limiting
- [ ] Add logging and monitoring
- [ ] Optimize Docker images for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project was developed as part of an internship at Indian Oil Corporation Limited (IOCL).

## 👨‍💻 Developer

**Project:** IOCL IT Asset Management System  
**Period:** Internship Project  
**Technologies:** React, TypeScript, Node.js, Express, MySQL

## 🙏 Acknowledgments

- Indian Oil Corporation Limited (IOCL) for the internship opportunity
- React and Node.js communities for excellent documentation
- All open-source contributors whose libraries made this possible

---

**Built with ❤️ during IOCL Internship**

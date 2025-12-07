# 🚀 Quick Start Commands

## Option 1: Docker (Fastest) 🐳

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Access app at http://localhost:5000
```

---

## Option 2: Manual Setup

### Terminal 1: Backend
```bash
cd backend
npm install
node index.js
```

### Terminal 2: Frontend
```bash
cd client
npm install
npm run dev
```

### Terminal 3: MySQL (if needed)
```bash
mysql -u root -p
source backend/setup.sql
```

---

## 📦 Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin1 | admin123 |
| Engineer | eng3 | eng123 |

---

## 🔧 Useful Commands

### Git
```bash
git status
git add .
git commit -m "message"
git push origin main
```

### Docker
```bash
docker ps                          # List running containers
docker-compose logs backend        # View backend logs
docker-compose logs mysql          # View MySQL logs
docker exec -it iocl_mysql bash   # Access MySQL container
docker system prune -a            # Clean up Docker
```

### MySQL
```bash
# Access database in Docker
docker exec -it iocl_mysql mysql -u root -pkrish it_asset_mgmt

# Or locally
mysql -u root -pkrish it_asset_mgmt

# Common queries
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM assets LIMIT 10;
DESC complaints;
```

### NPM
```bash
npm install           # Install dependencies
npm run dev          # Start dev server (frontend)
npm run build        # Build for production
node index.js        # Start backend
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend/index.js
```

### MySQL Connection Failed
```bash
# Check if MySQL is running
docker ps

# Restart MySQL
docker-compose restart mysql

# Check credentials in backend/db.js
```

### Frontend Not Loading
```bash
# Clear cache
rm -rf client/node_modules
cd client && npm install

# Or
npm run dev -- --force
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `README.md` | Project documentation |
| `DEPLOYMENT.md` | GitHub push guide |
| `docker-compose.yml` | Docker orchestration |
| `backend/db.js` | Database connection |
| `backend/setup.sql` | Database schema |
| `client/src/App.tsx` | Frontend routing |

---

## 🎯 Quick Tests

### Test Backend
```bash
curl http://localhost:5000/api/assets
```

### Test MySQL
```bash
docker exec -it iocl_mysql mysql -u root -pkrish -e "SELECT COUNT(*) FROM it_asset_mgmt.users;"
```

### Test Frontend
Open browser: `http://localhost:5173`

---

**Made with ❤️ for IOCL**

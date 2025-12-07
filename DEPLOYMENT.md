# 🚀 GitHub Deployment Guide

## Step-by-Step Instructions to Push to GitHub

### 1. Create a New Repository on GitHub

1. Go to [GitHub](https://github.com)
2. Click the **+** icon (top right) → **New repository**
3. Fill in the details:
   - **Repository name:** `iocl-asset-management` (or your preferred name)
   - **Description:** IT Asset Management System - IOCL Internship Project
   - **Visibility:** Choose Public or Private
   - ⚠️ **DO NOT** check "Initialize with README" (we already have one)
4. Click **Create repository**

### 2. Initialize Git in Your Project (If Not Already Done)

Open PowerShell in your project directory:

```powershell
cd "C:\Users\krish\Desktop\IOCL Internship\iocl"

# Initialize git
git init

# Set your git username and email (if not configured)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Add All Files to Git

```powershell
# Add all files
git add .

# Check what's being added
git status
```

### 4. Create Initial Commit

```powershell
git commit -m "Initial commit: IOCL IT Asset Management System

- Complete full-stack application
- React + TypeScript frontend
- Node.js + Express backend
- MySQL database with complete schema
- Docker support with docker-compose
- Role-based authentication (Admin/Engineer)
- Asset management with bulk upload
- Complaint tracking with engineer assignment
- Call logging system
- PM reports with file upload
- Analytics dashboard with real-time data"
```

### 5. Connect to GitHub Repository

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Verify remote is set
git remote -v
```

### 6. Push to GitHub

```powershell
# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### 7. Verify Upload

1. Go to your GitHub repository URL
2. Refresh the page
3. You should see all your files uploaded!

---

## 🔒 Important: Secure Your Credentials Before Pushing!

### Security Checklist

Before pushing, make sure:

- ✅ `.gitignore` is properly configured (already done)
- ✅ No sensitive passwords in code
- ⚠️ **Update `backend/db.js`** to use environment variables:

```javascript
// Instead of:
password: 'krish',

// Use:
password: process.env.DB_PASSWORD || 'krish',
```

- ⚠️ **Add note in README** about changing default passwords

### Create .env.example File

Create a file `backend/.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=it_asset_mgmt
PORT=5000
```

Then add to `.gitignore` (already done):
```
.env
.env.local
```

---

## 📦 Alternative: Push via GitHub Desktop

If you prefer a GUI:

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Install and sign in
3. Click **File** → **Add Local Repository**
4. Browse to your project folder
5. Publish repository to GitHub

---

## 🐛 Common Issues & Solutions

### Issue: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Issue: "Authentication failed"
```powershell
# Use Personal Access Token instead of password
# Generate token: GitHub → Settings → Developer settings → Personal access tokens → Generate new token
# Use token as password when prompted
```

### Issue: "Large files rejected"
```powershell
# Check file sizes
git ls-files | xargs ls -lh | sort -k5 -h -r | head -20

# If you have large files, add to .gitignore
# Or use Git LFS for files > 50MB
```

### Issue: Files not ignored
```powershell
# Clear git cache
git rm -r --cached .
git add .
git commit -m "Fix gitignore"
```

---

## ✅ Post-Upload Tasks

After successful push:

1. **Add Repository Description**
   - Go to repository → About → ⚙️ Edit
   - Add description and website link

2. **Add Topics/Tags**
   - Click "Add topics"
   - Examples: `react`, `typescript`, `nodejs`, `mysql`, `docker`, `asset-management`

3. **Enable GitHub Pages** (optional)
   - Settings → Pages → Deploy from branch (main)

4. **Add a License**
   - Add file → Create LICENSE
   - Choose appropriate license (MIT, Apache 2.0, etc.)

5. **Create Release**
   - Go to "Releases" → "Create a new release"
   - Tag: `v1.0.0`
   - Title: "Initial Release - IOCL Asset Management System"

---

## 🎉 Success!

Your project is now on GitHub! Share the link:
```
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
```

### Next Steps:
- Add screenshots to README
- Create a CHANGELOG.md
- Set up GitHub Actions for CI/CD
- Add badges (build status, license, etc.)

---

**Need Help?** Check [GitHub Docs](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-an-existing-project-to-github-using-the-command-line)

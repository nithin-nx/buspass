# BusID+ Digital Pass System

A professional, full-stack transit identity management system for colleges.

## 🚀 Features
- **Student Dashboard**: Real-time pass validity and profile details.
- **Admin Control Center**: Manage routes, users, and applications.
- **QR Scanning**: Live QR verification with trip-based validity deduction.
- **Attendance System**: Automatic attendance logging on each scan.
- **Professional Theme**: Clean, modern light theme with deep blue accents.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Axios, Chart.js, QRCode.react, html5-qrcode.
- **Backend**: Node.js, Express, MySQL.
- **Database**: MySQL 8.0+.

## ⚙️ Setup Instructions

### 1. Database Configuration
1. Install MySQL.
2. Execute the schema file located at `/database/schema.sql`.
   ```bash
   mysql -u root -p < database/schema.sql
   ```

### 2. Backend Setup
1. Navigate to the `backend` folder.
2. Create a `.env` file with the following:
   ```env
   PORT=5050
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_mysql_password
   DB_NAME=busid_plus
   ```
3. Install dependencies and start:
   ```bash
   npm install
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies and start:
   ```bash
   npm install
   npm run dev
   ```

## 🏗️ Folder Structure
- `/frontend`: Vite-React application.
- `/backend`: Express API server.
- `/database`: SQL schema and initialization scripts.

## 📄 License
MIT License

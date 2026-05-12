# Premium Wallet & Transaction Management System

A production-grade, full-stack application built with **NestJS**, **Next.js (App Router)**, and **PostgreSQL**. This system is designed for high-concurrency financial operations, featuring robust ACID-compliant transaction logic and a modern, high-tier fintech UI.

---

## 🏆 Submission Compliance Checklist

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **Graceful Error Handling** | Global exception handling in NestJS + local try/catch with feedback in UI. | ✅ |
| **Proper Validations** | DTO-level validation using `class-validator` and `ValidationPipe`. | ✅ |
| **Clean Coding Standards** | Modular architecture, Service/Controller separation, and TypeScript types. | ✅ |
| **Secure Password Storage** | Adaptive **Bcrypt** hashing (salt rounds: 10) for all user credentials. | ✅ |
| **Transaction Reliability** | Manual **QueryRunner** transactions with `pessimistic_write` row-locking. | ✅ |
| **Database Schema** | Relational schema with foreign keys and performance indices. See `schema.sql`. | ✅ |
| **API Documentation** | Fully interactive **Swagger UI** with live endpoint testing. | ✅ |
| **Setup Instructions** | Comprehensive guide for DB, Backend, and Frontend below. | ✅ |

---

## 🚀 Key Features
- **Dual Dashboard Interface**: Production-ready V1 and an expanded analytics-heavy V2.
- **Secure P2P Transfers**: ACID-compliant fund movement using PostgreSQL row-locking.
- **Instant Liquidity**: "Add Money" system to simulate bank-to-wallet funding.
- **Audit Ledger**: Real-time transaction history with advanced search, sort, and status filtering.
- **Collapsible Sidebar**: Dynamic responsive navigation with smooth state transitions.
- **Mobile Optimized**: Fully responsive layout using `100dvh` for mobile browser compatibility.

## 🛠️ Tech Stack
- **Backend**: NestJS, TypeORM, PostgreSQL, Swagger, Passport/JWT.
- **Frontend**: Next.js 15+, Tailwind CSS 4.0, Lucide Icons, Axios.
- **Reliability**: Pessimistic Database Locking for race-condition prevention.

---

## ⚡ Setup Instructions

### 📱 Mobile Access
To view the app on your mobile phone:
1. Ensure your phone and PC are on the same Wi-Fi.
2. Find your PC's IP address (e.g., `192.168.0.100`).
3. Access `http://[YOUR_IP]:3000` on your mobile browser.
*The app is configured with a built-in proxy to handle network requests seamlessly.*

---

## ☁️ Cloud Deployment (Free Strategy)

To host this project for free without running a local server, follow this proven stack:

### 1. Database (Neon.tech)
- Create a free account at [Neon.tech](https://neon.tech).
- Create a project and copy the **Connection String** (`postgres://...`).
- This will be your `DATABASE_URL` for the backend.

### 2. Backend (Render.com)
- Create a free account at [Render.com](https://render.com).
- Create a new **Web Service** and connect your GitHub repo.
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod` (or `node dist/main`)
- **Environment Variables**:
  - `DATABASE_URL`: Your Neon connection string.
  - `JWT_SECRET`: A long random string.
  - `PORT`: 10000 (Render default).

### 3. Frontend (Vercel.com)
- Create a free account at [Vercel.com](https://vercel.com).
- Connect your GitHub repo.
- **Root Directory**: `frontend`
- **Framework Preset**: Next.js.
- **Environment Variables**:
  - `BACKEND_INTERNAL_URL`: Your **Render** service URL (e.g., `https://wallet-api.onrender.com`).
  - `NEXT_PUBLIC_API_URL`: `/api-backend` (Keep as default for proxying).

### 4. Database Configuration (Local Fallback)
1. Create a PostgreSQL database named `wallet_db`.
2. Run the DDL found in `schema.sql` (optional, as TypeORM will auto-generate if configured).
3. Update `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=wallet_db
   JWT_SECRET=production_secret_key
   PORT=3001
   ```

### 2. Backend (API) Launch
```bash
cd backend
npm install
npm run start:dev
```
*API Docs available at: `http://localhost:3001/api/docs`*

### 3. Frontend (Web) Launch
```bash
cd frontend
npm install
npm run dev
```
*Web App available at: `http://localhost:3000`*

---

## 🛡️ Architecture & Security

### Concurrency Protection
The system prevents **Double-Spending** or balance mismatches by utilizing database-level transactions. When a transfer starts, the sender's and receiver's wallet rows are locked using `SELECT FOR UPDATE` (`pessimistic_write`), ensuring that no other process can modify the balance until the transaction commits or rolls back.

### API Documentation
The system exposes a Swagger UI at `/api/docs`. It provides:
- Detailed DTO schemas for all requests.
- Automatic Bearer Token header management.
- Live testing for all `Auth`, `User`, `Wallet`, and `Transaction` endpoints.


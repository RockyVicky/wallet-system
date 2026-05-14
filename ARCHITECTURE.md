# 🏗️ Wallet System Architecture Walkthrough

This document provides a visual and technical overview of the Premium Wallet & Transaction System. Use this as a reference for interview preparation or system design discussions.

---

## 1. System Architecture Diagram
This flowchart describes the end-to-end data flow from the user interaction to database persistence.

```mermaid
graph TD
    subgraph "Frontend (Next.js 15+)"
        UI["User Interface (React Components)"]
        Context["AuthContext (Global State)"]
        API_Client["Axios Client (lib/api.ts)"]
    end

    subgraph "Backend (NestJS)"
        Controller["Controllers (API Endpoints)"]
        Service["Services (Business Logic)"]
        TypeORM["TypeORM (Database Layer)"]
    end

    subgraph "Storage"
        DB[("PostgreSQL Database")]
    end

    %% Interaction Flow
    User((User)) --> UI
    UI --> Context
    Context --> API_Client
    API_Client -- "Secure HTTP (JWT)" --> Controller
    Controller --> Service
    Service -- "ACID Transaction" --> TypeORM
    TypeORM --> DB

    %% Optimization Highlight
    API_Client -.->| "60s Wakeup Ping" | Controller
```

---

## 2. Component Breakdown

### 📱 Frontend Layer (Next.js)
- **`src/app/login/page.tsx`**: The entry point. Implements the "Wake-up Trick" where a silent ping is sent to the backend on page load to eliminate Render.com's cold start delay.
- **`src/lib/api.ts`**: Centralized API configuration. Uses a 60-second timeout to handle high-latency scenarios and automatically attaches JWT Bearer tokens to headers.
- **`src/components/Vault3D.tsx`**: A premium UI element using **Three.js** and **React Three Fiber** to visualize a "Digital Vault," enhancing the high-tier fintech feel.

### ⚙️ Backend Layer (NestJS)
- **`transaction.service.ts`**: The core business engine. It manages P2P transfers using **Pessimistic Locking**. When a transfer starts, it locks the wallet rows in the database to prevent "Double Spending" or race conditions.
- **`app.controller.ts`**: Contains the `/health` endpoint used by the frontend for pre-emptive server wake-ups.
- **`wallet.entity.ts`**: The database schema for user balances, ensuring strict data types and relational integrity with the User table.

### 🗄️ Database Layer (PostgreSQL)
- **ACID Compliance**: All financial movements are wrapped in a single transaction. If the receiver's wallet cannot be updated, the sender's deduction is automatically rolled back.
- **Indexing**: Database indices on `email` and `walletId` ensure that lookups remain sub-millisecond even as the user base grows.

---

## 3. Interview "Cheat Sheet"

| Topic | Quick Answer |
| :--- | :--- |
| **Concurrency** | "I used Pessimistic Row Locking in TypeORM to handle simultaneous transactions safely." |
| **Performance** | "I optimized the frontend with a 60s timeout and pre-emptive wake-up pings to handle free-tier hosting limitations." |
| **Security** | "All routes are protected by JWT Auth Guards, and passwords are encrypted using Bcrypt (10 salt rounds)." |
| **Stack Choice** | "NestJS provides a modular structure, while Next.js App Router offers superior performance and SEO." |

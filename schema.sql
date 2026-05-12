-- Database Schema for Wallet & Transaction Management System

-- 1. Users Table
-- Stores user identity and authentication credentials
CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "phone" VARCHAR(20),
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Wallets Table
-- Stores currency balance for each user (1:1 Relationship)
CREATE TABLE "wallets" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID UNIQUE NOT NULL,
    "balance" DECIMAL(12, 2) DEFAULT 0.00,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

-- 3. Transactions Table
-- Audit ledger for all money movements between wallets
CREATE TABLE "transactions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "sender_wallet_id" UUID, -- NULL if "Add Money" (system deposit)
    "receiver_wallet_id" UUID NOT NULL,
    "amount" DECIMAL(12, 2) NOT NULL,
    "status" VARCHAR(20) DEFAULT 'COMPLETED', -- PENDING, COMPLETED, FAILED
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_sender" FOREIGN KEY ("sender_wallet_id") REFERENCES "wallets"("id"),
    CONSTRAINT "fk_receiver" FOREIGN KEY ("receiver_wallet_id") REFERENCES "wallets"("id")
);

-- Indices for performance
CREATE INDEX "idx_user_email" ON "users"("email");
CREATE INDEX "idx_transaction_wallets" ON "transactions"("sender_wallet_id", "receiver_wallet_id");

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('transfer', 'payment', 'cashout');

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "accountExternalIdDebit" TEXT NOT NULL,
    "accountExternalIdCredit" TEXT NOT NULL,
    "transferTypeId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "status" "public"."TransactionStatus" NOT NULL DEFAULT 'pending',
    "type" "public"."TransactionType" NOT NULL DEFAULT 'transfer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

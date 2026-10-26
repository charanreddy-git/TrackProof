-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CAPTAIN');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('OPEN', 'ACCEPTED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneVerifiedAt" TIMESTAMP(3),
    "email" TEXT,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhoneOtp" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "sendCount" INTEGER NOT NULL DEFAULT 1,
    "windowStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhoneOtp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaptainProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceRadius" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "verificationCount" INTEGER NOT NULL DEFAULT 0,
    "completionRate" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    "earningsTotal" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,

    CONSTRAINT "CaptainProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequesterProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationName" TEXT,
    "totalRequests" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RequesterProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetLat" DOUBLE PRECISION NOT NULL,
    "targetLng" DOUBLE PRECISION NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'OPEN',
    "evidenceImage" TEXT,
    "createdById" TEXT NOT NULL,
    "acceptedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationLog" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "taskId" TEXT NOT NULL,
    "captainId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PhoneOtp_phone_key" ON "PhoneOtp"("phone");

-- CreateIndex
CREATE INDEX "PhoneOtp_expiresAt_idx" ON "PhoneOtp"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "CaptainProfile_userId_key" ON "CaptainProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RequesterProfile_userId_key" ON "RequesterProfile"("userId");

-- CreateIndex
CREATE INDEX "Task_createdById_idx" ON "Task"("createdById");

-- CreateIndex
CREATE INDEX "Task_acceptedById_idx" ON "Task"("acceptedById");

-- CreateIndex
CREATE INDEX "LocationLog_taskId_timestamp_idx" ON "LocationLog"("taskId", "timestamp");

-- AddForeignKey
ALTER TABLE "CaptainProfile" ADD CONSTRAINT "CaptainProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequesterProfile" ADD CONSTRAINT "RequesterProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationLog" ADD CONSTRAINT "LocationLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

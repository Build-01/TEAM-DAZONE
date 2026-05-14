-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('WORKER', 'TRADER', 'EMPLOYER', 'AGENT');

-- CreateEnum
CREATE TYPE "GigStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DISPUTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('NONE', 'OPEN', 'RESOLVED_WORKER', 'RESOLVED_CLIENT');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'SHORTLISTED', 'INTERVIEWED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('GIG_PAYMENT', 'ESCROW_FUND', 'ESCROW_RELEASE', 'PENSION_CONTRIBUTION', 'SAVINGS_TRANSFER', 'REFUND');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PensionStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "voiceIntroduction" TEXT,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "location" TEXT NOT NULL,
    "locationCoordinates" TEXT,
    "economicIdentityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pensionScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "communityTrustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userType" "UserType" NOT NULL DEFAULT 'WORKER',
    "bankName" TEXT,
    "accountNumber" TEXT,
    "bvn" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationDate" TIMESTAMP(3),
    "communityVerified" BOOLEAN NOT NULL DEFAULT false,
    "communityVerifiers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActiveAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skills" TEXT[],
    "experienceLevel" TEXT NOT NULL DEFAULT 'beginner',
    "certifications" TEXT[],
    "totalGigsCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalGigsRejected" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "onTimeCompletionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "qualityRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "communicationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TraderProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessCategory" TEXT NOT NULL,
    "shopLocation" TEXT NOT NULL,
    "businessRegistration" TEXT,
    "taxId" TEXT,
    "monthlyTransactionVolume" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "inventoryValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "businessAge" INTEGER NOT NULL,
    "averageTransactionSize" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "transactionConsistency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "repaymentConsistency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "seasonalActivity" TEXT,
    "marketDemandTrend" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TraderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gig" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "requiredSkills" TEXT[],
    "location" TEXT NOT NULL,
    "paymentAmount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "duration" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "language" TEXT NOT NULL DEFAULT 'en',
    "status" "GigStatus" NOT NULL DEFAULT 'OPEN',
    "maxWorkers" INTEGER NOT NULL DEFAULT 1,
    "squadEscrowId" TEXT,
    "escrowStatus" TEXT NOT NULL DEFAULT 'not_initiated',
    "escrowAmount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Gig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GigApplication" (
    "id" TEXT NOT NULL,
    "gigId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "matchScore" DOUBLE PRECISION NOT NULL,
    "skillMatchPercentage" DOUBLE PRECISION NOT NULL,
    "locationDistance" DOUBLE PRECISION NOT NULL,
    "trustScoreAtApplication" DOUBLE PRECISION NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "rejectedReason" TEXT,
    "interviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GigApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "gigId" TEXT,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "transactionType" "TransactionType" NOT NULL,
    "pensionContribution" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "savingsContribution" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "squadTransactionId" TEXT,
    "squadReference" TEXT,
    "squadStatus" TEXT,
    "escrowId" TEXT,
    "escrowStatus" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "failureReason" TEXT,
    "initiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PensionAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pensionBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalContributions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "contributionCount" INTEGER NOT NULL DEFAULT 0,
    "contributionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "pensionProvider" TEXT NOT NULL DEFAULT 'system',
    "providerAccountId" TEXT,
    "monthlyContributions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastContributionDate" TIMESTAMP(3),
    "averageMonthlyContribution" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "squadWalletId" TEXT,
    "projectedRetirementAge" INTEGER NOT NULL DEFAULT 65,
    "projectedRetirementIncome" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "PensionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PensionAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavingsWallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDeposited" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalWithdrawn" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "savingsGoals" TEXT[],
    "autoSavingsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "autoSavingsPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "squadWalletId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavingsWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustCredit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pensionConsistencyScore" DOUBLE PRECISION NOT NULL,
    "escrowCompletionRate" DOUBLE PRECISION NOT NULL,
    "savingsDisciplineScore" DOUBLE PRECISION NOT NULL,
    "communityTrustScore" DOUBLE PRECISION NOT NULL,
    "overallTrustScore" DOUBLE PRECISION NOT NULL,
    "eligible" BOOLEAN NOT NULL DEFAULT false,
    "eligibilityThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "partnerBanks" TEXT[],
    "lastMonitoredAt" TIMESTAMP(3),
    "monitoringFrequency" TEXT NOT NULL DEFAULT 'weekly',
    "externalCreditActive" BOOLEAN NOT NULL DEFAULT false,
    "repaymentAnomalies" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrustCredit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityEndorsement" (
    "id" TEXT NOT NULL,
    "endorsedUserId" TEXT NOT NULL,
    "endorserId" TEXT NOT NULL,
    "endorserName" TEXT NOT NULL,
    "endorserLocation" TEXT NOT NULL,
    "endorsementType" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustScoreLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gigId" TEXT,
    "contractId" TEXT,
    "change" DOUBLE PRECISION NOT NULL,
    "previousScore" DOUBLE PRECISION NOT NULL,
    "newScore" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrustScoreLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "gigId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "workerConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "clientConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContractStatus" NOT NULL DEFAULT 'PENDING',
    "disputeStatus" "DisputeStatus" NOT NULL DEFAULT 'NONE',
    "disputeReason" TEXT,
    "workerRating" INTEGER,
    "clientRating" INTEGER,
    "completedAt" TIMESTAMP(3),
    "trustFrozen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "revieweeId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT NOT NULL,
    "reviewType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SquadWebhookLog" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "webhookPayload" TEXT NOT NULL,
    "transactionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'processed',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SquadWebhookLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EconomicInsight" (
    "id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "trend" TEXT NOT NULL DEFAULT 'stable',
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EconomicInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_location_idx" ON "User"("location");

-- CreateIndex
CREATE INDEX "User_userType_idx" ON "User"("userType");

-- CreateIndex
CREATE INDEX "User_economicIdentityScore_idx" ON "User"("economicIdentityScore");

-- CreateIndex
CREATE UNIQUE INDEX "WorkerProfile_userId_key" ON "WorkerProfile"("userId");

-- CreateIndex
CREATE INDEX "WorkerProfile_userId_idx" ON "WorkerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TraderProfile_userId_key" ON "TraderProfile"("userId");

-- CreateIndex
CREATE INDEX "TraderProfile_userId_idx" ON "TraderProfile"("userId");

-- CreateIndex
CREATE INDEX "Gig_creatorId_idx" ON "Gig"("creatorId");

-- CreateIndex
CREATE INDEX "Gig_status_idx" ON "Gig"("status");

-- CreateIndex
CREATE INDEX "Gig_location_idx" ON "Gig"("location");

-- CreateIndex
CREATE INDEX "Gig_startDate_idx" ON "Gig"("startDate");

-- CreateIndex
CREATE INDEX "GigApplication_gigId_idx" ON "GigApplication"("gigId");

-- CreateIndex
CREATE INDEX "GigApplication_applicantId_idx" ON "GigApplication"("applicantId");

-- CreateIndex
CREATE INDEX "GigApplication_status_idx" ON "GigApplication"("status");

-- CreateIndex
CREATE UNIQUE INDEX "GigApplication_gigId_applicantId_key" ON "GigApplication"("gigId", "applicantId");

-- CreateIndex
CREATE INDEX "Transaction_fromUserId_idx" ON "Transaction"("fromUserId");

-- CreateIndex
CREATE INDEX "Transaction_gigId_idx" ON "Transaction"("gigId");

-- CreateIndex
CREATE INDEX "Transaction_transactionType_idx" ON "Transaction"("transactionType");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_squadTransactionId_idx" ON "Transaction"("squadTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "PensionAccount_userId_key" ON "PensionAccount"("userId");

-- CreateIndex
CREATE INDEX "PensionAccount_userId_idx" ON "PensionAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavingsWallet_userId_key" ON "SavingsWallet"("userId");

-- CreateIndex
CREATE INDEX "SavingsWallet_userId_idx" ON "SavingsWallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TrustCredit_userId_key" ON "TrustCredit"("userId");

-- CreateIndex
CREATE INDEX "TrustCredit_userId_idx" ON "TrustCredit"("userId");

-- CreateIndex
CREATE INDEX "TrustCredit_eligible_idx" ON "TrustCredit"("eligible");

-- CreateIndex
CREATE INDEX "CommunityEndorsement_endorsedUserId_idx" ON "CommunityEndorsement"("endorsedUserId");

-- CreateIndex
CREATE INDEX "TrustScoreLog_userId_idx" ON "TrustScoreLog"("userId");

-- CreateIndex
CREATE INDEX "TrustScoreLog_gigId_idx" ON "TrustScoreLog"("gigId");

-- CreateIndex
CREATE INDEX "TrustScoreLog_contractId_idx" ON "TrustScoreLog"("contractId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_gigId_key" ON "Contract"("gigId");

-- CreateIndex
CREATE INDEX "Contract_workerId_idx" ON "Contract"("workerId");

-- CreateIndex
CREATE INDEX "Contract_clientId_idx" ON "Contract"("clientId");

-- CreateIndex
CREATE INDEX "Contract_status_idx" ON "Contract"("status");

-- CreateIndex
CREATE INDEX "Contract_disputeStatus_idx" ON "Contract"("disputeStatus");

-- CreateIndex
CREATE INDEX "Review_reviewerId_idx" ON "Review"("reviewerId");

-- CreateIndex
CREATE INDEX "Review_revieweeId_idx" ON "Review"("revieweeId");

-- CreateIndex
CREATE INDEX "SquadWebhookLog_eventType_idx" ON "SquadWebhookLog"("eventType");

-- CreateIndex
CREATE INDEX "SquadWebhookLog_transactionId_idx" ON "SquadWebhookLog"("transactionId");

-- CreateIndex
CREATE INDEX "EconomicInsight_region_idx" ON "EconomicInsight"("region");

-- CreateIndex
CREATE INDEX "EconomicInsight_metric_idx" ON "EconomicInsight"("metric");

-- CreateIndex
CREATE INDEX "EconomicInsight_recordedAt_idx" ON "EconomicInsight"("recordedAt");

-- AddForeignKey
ALTER TABLE "WorkerProfile" ADD CONSTRAINT "WorkerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraderProfile" ADD CONSTRAINT "TraderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gig" ADD CONSTRAINT "Gig_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GigApplication" ADD CONSTRAINT "GigApplication_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GigApplication" ADD CONSTRAINT "GigApplication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PensionAccount" ADD CONSTRAINT "PensionAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingsWallet" ADD CONSTRAINT "SavingsWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrustCredit" ADD CONSTRAINT "TrustCredit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityEndorsement" ADD CONSTRAINT "CommunityEndorsement_endorsedUserId_fkey" FOREIGN KEY ("endorsedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrustScoreLog" ADD CONSTRAINT "TrustScoreLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

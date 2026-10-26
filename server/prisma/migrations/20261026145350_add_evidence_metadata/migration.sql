-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "evidenceAccuracy" DOUBLE PRECISION,
ADD COLUMN     "evidenceCapturedAt" TIMESTAMP(3),
ADD COLUMN     "evidenceLat" DOUBLE PRECISION,
ADD COLUMN     "evidenceLng" DOUBLE PRECISION,
ADD COLUMN     "evidenceSubmittedAt" TIMESTAMP(3);

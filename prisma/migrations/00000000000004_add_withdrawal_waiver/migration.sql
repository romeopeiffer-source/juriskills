-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "withdrawalWaived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "withdrawalWaivedAt" TIMESTAMP(3);


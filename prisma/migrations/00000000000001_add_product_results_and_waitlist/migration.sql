-- CreateEnum
CREATE TYPE "ProductResultType" AS ENUM ('IMAGE', 'TEXT');

-- CreateTable
CREATE TABLE "ProductResult" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "ProductResultType" NOT NULL,
    "imageUrl" TEXT,
    "textContent" TEXT,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitlistSignup" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitlistSignup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductResult_productId_idx" ON "ProductResult"("productId");

-- CreateIndex
CREATE INDEX "WaitlistSignup_category_idx" ON "WaitlistSignup"("category");

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistSignup_email_category_key" ON "WaitlistSignup"("email", "category");

-- AddForeignKey
ALTER TABLE "ProductResult" ADD CONSTRAINT "ProductResult_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;


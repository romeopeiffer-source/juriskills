-- AlterTable
ALTER TABLE "Product" DROP COLUMN "contents",
DROP COLUMN "shortDescription",
ADD COLUMN     "videoUrl" TEXT;


-- DropIndex
DROP INDEX "Post_featuredImageId_key";

-- DropIndex
DROP INDEX "Post_ogImageId_key";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "updatedAt" DROP DEFAULT;

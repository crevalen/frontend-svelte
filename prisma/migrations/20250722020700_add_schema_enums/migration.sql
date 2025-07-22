/*
  Warnings:

  - The `schemaType` column on the `Page` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `schemaType` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SchemaType" AS ENUM ('BlogPosting', 'Article', 'NewsArticle', 'FAQPage');

-- CreateEnum
CREATE TYPE "PageSchemaType" AS ENUM ('WebPage', 'AboutPage', 'ContactPage', 'PrivacyPolicyPage', 'TermsOfServicePage');

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "schemaType",
ADD COLUMN     "schemaType" "PageSchemaType" DEFAULT 'WebPage';

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "schemaType",
ADD COLUMN     "schemaType" "SchemaType" DEFAULT 'BlogPosting';

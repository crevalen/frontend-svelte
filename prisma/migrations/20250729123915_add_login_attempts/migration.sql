/*
  Warnings:

  - Added the required column `ip` to the `LoginAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `success` to the `LoginAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoginAttempt" ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "success" BOOLEAN NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LoginAttempt" ADD CONSTRAINT "LoginAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

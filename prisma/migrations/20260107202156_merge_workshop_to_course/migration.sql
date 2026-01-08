/*
  Warnings:

  - You are about to drop the `Workshop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_InstructorToWorkshop` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('COURSE', 'WORKSHOP');

-- DropForeignKey
ALTER TABLE "_InstructorToWorkshop" DROP CONSTRAINT "_InstructorToWorkshop_A_fkey";

-- DropForeignKey
ALTER TABLE "_InstructorToWorkshop" DROP CONSTRAINT "_InstructorToWorkshop_B_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "applicationDeadline" TIMESTAMP(3),
ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "type" "CourseType" NOT NULL DEFAULT 'COURSE',
ALTER COLUMN "duration" DROP NOT NULL,
ALTER COLUMN "curriculum" DROP NOT NULL;

-- DropTable
DROP TABLE "Workshop";

-- DropTable
DROP TABLE "_InstructorToWorkshop";

-- DropEnum
DROP TYPE "WorkshopStatus";

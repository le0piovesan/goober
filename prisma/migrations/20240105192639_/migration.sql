-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'Regular';

-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'Regular';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "originalTotal" DECIMAL(65,30),
ADD COLUMN     "totalDiscount" DECIMAL(65,30);

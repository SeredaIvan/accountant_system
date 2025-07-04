/*
  Warnings:

  - You are about to drop the column `weight` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `_DishProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DishProducts" DROP CONSTRAINT "_DishProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_DishProducts" DROP CONSTRAINT "_DishProducts_B_fkey";

-- AlterTable
ALTER TABLE "Day" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Dish" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "weight",
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "_DishProducts";

-- CreateTable
CREATE TABLE "DishProduct" (
    "id" TEXT NOT NULL,
    "dishId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DishProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DishProduct_dishId_productId_key" ON "DishProduct"("dishId", "productId");

-- AddForeignKey
ALTER TABLE "DishProduct" ADD CONSTRAINT "DishProduct_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DishProduct" ADD CONSTRAINT "DishProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

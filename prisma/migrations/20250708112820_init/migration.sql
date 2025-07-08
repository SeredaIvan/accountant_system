/*
  Warnings:

  - You are about to drop the `_DishDays` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DishDays" DROP CONSTRAINT "_DishDays_A_fkey";

-- DropForeignKey
ALTER TABLE "_DishDays" DROP CONSTRAINT "_DishDays_B_fkey";

-- DropTable
DROP TABLE "_DishDays";

-- CreateTable
CREATE TABLE "DayDish" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "dishId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DayDish_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DayDish_dayId_dishId_key" ON "DayDish"("dayId", "dishId");

-- AddForeignKey
ALTER TABLE "DayDish" ADD CONSTRAINT "DayDish_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayDish" ADD CONSTRAINT "DayDish_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

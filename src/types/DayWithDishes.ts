import { Prisma } from "@/generated/prisma";
import { DayDish } from "@/generated/prisma";

export type DayWithDishes = Prisma.DayGetPayload<{
  include: {dayDishes:true}
}>
export type DayDishType =  Omit<DayDish,"createdAt" |"updatedAt">;
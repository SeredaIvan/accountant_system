import { Day } from "@/generated/prisma";
import { DishWithProducts } from "@/types/DishWithProducts";

export interface DayWithFullDishes extends Day {
  dishes: DishWithProducts[];
}
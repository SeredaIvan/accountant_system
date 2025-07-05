import { Dish, DishProduct, Product } from "@/generated/prisma";

export interface DishWithProducts extends Dish {
  products: (DishProduct & {
    product: Product;
  })[];
}
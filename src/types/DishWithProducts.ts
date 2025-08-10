import { Prisma } from "@/generated/prisma";
export type DishWithProducts = Prisma.DishGetPayload<{
  include: { products: true };
}>;

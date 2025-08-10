import { DayDish, Dish } from "@/generated/prisma";

export function intersectionDishes(setA:Set<Dish>, setB:Set<Dish>) {
  const _intersection = new Set<Dish>();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}
export function intersectionDaysDish(setA:Set<DayDish>, setB:Set<DayDish>) {
  const _intersection = new Set<DayDish>();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}



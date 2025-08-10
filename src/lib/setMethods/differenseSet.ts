import { DayDish, Dish } from "@/generated/prisma";

export function differenceDish(setA:Set<Dish>, setB:Set<Dish>) {
  const _difference = new Set<Dish>(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

export function differenceDayDish(setA:Set<DayDish>, setB:Set<DayDish>) {
  const _difference = new Set<DayDish>(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

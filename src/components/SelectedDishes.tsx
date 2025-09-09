import { DayDishType } from "@/types/DayWithDishes";
import { DishWithProducts } from "@/types/DishWithProducts";
import { useDishesStore } from "@/stores/dishesStore";
import { DishTile } from "./DishTile";

type SelectedDishesProps = {
  selectedDishes: DayDishType[];
};
function SelectedDishes({ selectedDishes }: SelectedDishesProps) {
  const dishes: DishWithProducts[] = useDishesStore(
    (state) => state.dishes ?? []
  );
  const selectedDishesSet = new Set(selectedDishes.map((dish) => dish.id));
  return(<div>
    <h3 className="mb-2 text-xl font-semibold text-gray-700">Обрані страви:</h3>
    <div className="border rounded-md divide-y divide-gray-200 overflow-hidden shadow-sm">
      {selectedDishes.length === 0 && (
        <p className="p-4 text-gray-500 text-center">Страви не обрано</p>
      )}
      {dishes.map((dish) =>
        selectedDishesSet.has(dish.id) ? (
          <DishTile key={dish .id} dish={dish} />
        ) : null
      )}
    </div>
  </div>)
}
export default SelectedDishes;

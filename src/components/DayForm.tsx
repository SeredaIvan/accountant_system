import { useEffect, useState } from "react";
import { DishTile } from "./DishTile";
import { useDishesStore } from "@/stores/dishesStore";
import { useDaysStore } from "@/stores/daysStore";
import { DishWithProducts } from "@/types/DishWithProducts";
import { DayWithDishes } from "@/types/DayWithDishes";
import { DayDishType } from "@/types/DayWithDishes";
import SelectedDishes from "./SelectedDishes";

export function DayForm() {
  const dayData: DayWithDishes | null = useDaysStore((state) => state.days);
  const setDayData = useDaysStore((state) => state.setDays);

  const dishes: DishWithProducts[] = useDishesStore(
    (state) => state.dishes ?? []
  );


  const [countKids, setCountKids] = useState<number>(dayData?.countKids || 0);
  const [selectedDishId, setSelectedDishId] = useState<string>("");
  const [selectedDishes, setSelectedDishes] = useState<DayDishType[]>([]);

  useEffect(() => {
    if (dayData) {
      setCountKids(dayData.countKids || 0);
      setSelectedDishes(dayData.dayDishes || []);
    }
  }, [dayData]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedDish = dishes.find((d) => d.id === selectedId);
    if (dayData && selectedDish) {
      const selectedDayDish: DayDishType = {
        id: selectedId,
        dayId: dayData.id,
        dishId: selectedDish.id,
      };
      if (
        selectedDish &&
        !selectedDishes.find((d) => d.id === selectedDish.id)
      ) {
        setSelectedDishes((prev) => [...prev, selectedDayDish]);
      }
    }
    setSelectedDishId("");
  };

  const availableDishes = dishes.filter(
    (d) => !selectedDishes.find((sd) => sd.id === d.id)
  );

  if (!dayData) return <></>;

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-md shadow-md">
      <p className="mb-4 text-lg font-semibold text-gray-700">
        Дата: {new Date(dayData.date).toLocaleDateString("uk-UA")}
      </p>

      <label
        htmlFor="countKids"
        className="block mb-1 font-medium text-gray-600"
      >
        Кількість дітей:
      </label>
      <input
        id="countKids"
        name="countKids"
        type="number"
        min={0}
        value={countKids === 0 ? "" : countKids}
        onChange={(e) => setCountKids(Number(e.target.value))}
        className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Введіть кількість дітей"
      />

      <div className="mb-6">
        <label
          htmlFor="dishSelect"
          className="block mb-1 font-medium text-gray-600"
        >
          Додати страву:
        </label>
        <select
          id="dishSelect"
          value={selectedDishId}
          onChange={handleSelectChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          <option value="" disabled>
            Оберіть страву
          </option>
          {availableDishes.map((dish) => (
            <option key={dish.id} value={dish.id}>
              {dish.name}
            </option>
          ))}
        </select>
      </div>
      <SelectedDishes selectedDishes={selectedDishes}/>
      
    </div>
  );
}

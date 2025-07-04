import { Day, Dish } from "@/generated/prisma";
import { useEffect, useState } from "react";
import { DishTile } from "./DishTile";

interface DayWithDishes extends Day {
  dishes: Dish[];
}

interface DishWithComputedWeight extends Dish {
  computedWeight?: number;
}

interface DayFormProps {
  dayData: DayWithDishes;
  dishes: Dish[];
}

export function DayForm({ dayData, dishes }: DayFormProps) {
  const [countKids, setCountKids] = useState<number>(dayData.countKids || 0);
  const [truthDishes, setTruthDishes] = useState<DishWithComputedWeight[]>([]);
  const [selectedDishId, setSelectedDishId] = useState<string>("");

  useEffect(() => {
    const initialDishes = (dayData.dishes || []).map((d) => ({
      ...d,
      computedWeight: d.weight * countKids,
    }));
    setTruthDishes(initialDishes);
    setCountKids(dayData.countKids || 0);
  }, [dayData]);

  useEffect(() => {
    setTruthDishes((prev) =>
      prev.map((dish) => ({
        ...dish,
        computedWeight: dish.weight * countKids,
      }))
    );
  }, [countKids]);

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = e.target.value;
    setSelectedDishId(selectedId);
    const selectedDish = dishes.find((d) => d.id === selectedId);
    if (selectedDish && !truthDishes.find((d) => d.id === selectedDish.id)) {
      setTruthDishes((prev) => [
        ...prev,
        { ...selectedDish, computedWeight: selectedDish.weight * countKids },
      ]);
      setSelectedDishId("");
    }
  }

  const availableDishes = dishes.filter(
    (d) => !truthDishes.find((td) => td.id === d.id)
  );
  console.log(dayData.date)
  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-md shadow-md">
    <p className="mb-4 text-lg font-semibold text-gray-700">
      Дата: {formatDateToDMY(new Date(dayData.date))}
    </p>
      <label htmlFor="countKids" className="block mb-1 font-medium text-gray-600">
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
        <label htmlFor="dishSelect" className="block mb-1 font-medium text-gray-600">
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
              {dish.name} ({dish.product}) - {dish.weight} г
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-2 text-xl font-semibold text-gray-700">Обрані страви:</h3>
        <div className="border rounded-md divide-y divide-gray-200 overflow-hidden shadow-sm">
          {truthDishes.length === 0 && (
            <p className="p-4 text-gray-500 text-center">Страви не обрано</p>
          )}
          {truthDishes.map((dish) => (
            <DishTile key={dish.id} dish={dish} />
          ))}
        </div>
      </div>
    </div>
  );
  function formatDateToDMY(dateInput: string | Date): string {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const day = d.getUTCDate().toString().padStart(2, "0");
    const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

}

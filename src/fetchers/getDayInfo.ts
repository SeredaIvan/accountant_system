import { DayWithDishes } from "@/types/DayWithDishes";


export default async function getDayInfo(
    day: number,
    month: number,
    year: number
  ): Promise<DayWithDishes | {error:string}> {
    try {
      const res = await fetch(`/api/v1.0/days/${day}-${month}-${year}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const result = await fetch("/api/v1.0/days", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            countKids: 0,
            dishes: [],
          }),
        });
        if (!result.ok) {
          return { error : "Помилка створення дня"};
        }

        const createdData = await result.json();
        const dayData :DayWithDishes =createdData.dayData
        return  dayData;
      }
      const data = await res.json();

      if (data.error) {
        return ({error:data.error})
      }
      const dayData :DayWithDishes = data.dayData;
      return dayData;
    } catch (e) {
      return ({error:"Несподівана помилка"});
    }
  }
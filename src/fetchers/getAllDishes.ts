import { DishWithProducts } from "@/types/DishWithProducts";

export default async function getAllDishes():Promise<DishWithProducts[]|{error:string}> {
    try {
      const res = await fetch("http://localhost:3000/api/v1.0/dishes/get-all", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        return data.dishes as DishWithProducts[];
      } else {
        return {error : "Помилка отримання страв"};
      }
    } catch (error) {
      return {error :"Несподівана помилка"}
    }
  }
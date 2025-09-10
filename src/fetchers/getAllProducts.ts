import { Product } from "@/types/Product";

export default async function getAllProducts():Promise<Product[]|{error:string}> {
    try {
      const res = await fetch("http://localhost:3000/api/v1.0/products/get-all", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        return data.products as Product[];
      } else {
        return {error : "Помилка отримання продуктів"};
      }
    } catch (error) {
      return {error :"Несподівана помилка"}
    }
  }



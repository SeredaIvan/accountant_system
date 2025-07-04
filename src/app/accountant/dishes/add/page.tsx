"use client";
import { useState } from "react";
import { MessageBox } from "@/components/MessageBox";

  const DishesAdd=()=> {
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [weight, setWeight] = useState<number | "">("");
  const [successMessages, setSuccessMessages] = useState<string[] | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessages(null);
    setErrorMessages(null);

    if (!name || !product || !weight) {
      setErrorMessages(["Усі поля обов’язкові"]);
      return;
    }

    try {
      const res = await fetch("/api/v1.0/dishes/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, product, weight }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessages([data.error || "Помилка додавання"]);
        return;
      }

      setSuccessMessages(["Страву додано успішно"]);
      setName("");
      setProduct("");
      setWeight("");
    } catch (err) {
      console.error(err);
      setErrorMessages(["Несподівана помилка при відправці"]);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md mt-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Додати страву</h1>

      {successMessages && <MessageBox messages={successMessages} type="success" />}
      {errorMessages && <MessageBox messages={errorMessages} type="error" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium text-gray-700">
            Назва страви:
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Наприклад: Борщ"
          />
        </div>

        <div>
          <label htmlFor="product" className="block font-medium text-gray-700">
            Продукт:
          </label>
          <input
            type="text"
            id="product"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Наприклад: Буряк"
          />
        </div>

        <div>
          <label htmlFor="weight" className="block font-medium text-gray-700">
            Вага (в грамах):
          </label>
          <input
            type="number"
            id="weight"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={weight === "" ? "" : weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            placeholder="Наприклад: 150"
            min={0}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Зберегти страву
        </button>
      </form>
    </div>
  );
}

export default DishesAdd;

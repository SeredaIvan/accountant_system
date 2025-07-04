"use client";

import { useState } from "react";
import { MessageBox } from "@/components/MessageBox";

const ProductAdd = () => {
  const [name, setName] = useState("");
  const [successMessages, setSuccessMessages] = useState<string[] | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessages(null);
    setErrorMessages(null);

    if (!name.trim()) {
      setErrorMessages(["Назва продукту обов’язкова"]);
      return;
    }

    try {
      const res = await fetch("/api/v1.0/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessages([data.error || "Помилка додавання продукту"]);
        return;
      }

      setSuccessMessages(["Продукт додано успішно"]);
      setName("");
    } catch (err) {
      console.error(err);
      setErrorMessages(["Несподівана помилка при відправці"]);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md mt-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Додати продукт</h1>

      {successMessages && <MessageBox messages={successMessages} type="success" />}
      {errorMessages && <MessageBox messages={errorMessages} type="error" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium text-gray-700">
            Назва продукту:
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Наприклад: Картопля"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Зберегти продукт
        </button>
      </form>
    </div>
  );
};

export default ProductAdd;

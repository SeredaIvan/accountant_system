"use client";
import { useEffect, useState } from "react";
import { MessageBox } from "@/components/MessageBox";

type Product = {
  id: string;
  name: string;
};

type SelectedProduct = {
  productId: string;
  name: string;
  weight: number | "";
};

const DishesAdd = () => {
  const [name, setName] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [successMessages, setSuccessMessages] = useState<string[] | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/v1.0/products/get-all");
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        setErrorMessages(["Не вдалося завантажити продукти"]);
      }
    }
    fetchProducts();
  }, []);

  function addProduct() {
    setSuccessMessages(null);
    setErrorMessages(null);

    if (!selectedProductId) {
      setErrorMessages(["Оберіть продукт"]);
      return;
    }
    if (selectedProducts.find(p => p.productId === selectedProductId)) {
      setErrorMessages(["Цей продукт вже доданий"]);
      return;
    }

    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) {
      setErrorMessages(["Продукт не знайдено"]);
      return;
    }

    setSelectedProducts([...selectedProducts, { productId: prod.id, name: prod.name, weight: "" }]);
    setSelectedProductId("");
  }

  function removeProduct(productId: string) {
    setSelectedProducts(selectedProducts.filter(p => p.productId !== productId));
  }

  function updateWeight(productId: string, weight: number | "") {
    setSelectedProducts(selectedProducts.map(p => p.productId === productId ? { ...p, weight } : p));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessages(null);
    setErrorMessages(null);

    if (!name.trim()) {
      setErrorMessages(["Назва страви обов’язкова"]);
      return;
    }
    if (selectedProducts.length === 0) {
      setErrorMessages(["Додайте принаймні один продукт"]);
      return;
    }
    for (const p of selectedProducts) {
      if (p.weight === "" || p.weight <= 0) {
        setErrorMessages([`Вага для продукту "${p.name}" має бути більшою за 0`]);
        return;
      }
    }

    try {
      const res = await fetch("/api/v1.0/dishes/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          products: selectedProducts.map(p => ({ productId: p.productId, weight: p.weight }))
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessages([data.error || "Помилка додавання"]);
        return;
      }

      setSuccessMessages(["Страву додано успішно"]);
      setName("");
      setSelectedProducts([]);
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
          <label htmlFor="product-select" className="block font-medium text-gray-700 mb-1">
            Виберіть продукт:
          </label>
          <select
            id="product-select"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="">-- оберіть продукт --</option>
            {products
              .filter(p => !selectedProducts.some(sp => sp.productId === p.id))
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
          <button
            type="button"
            onClick={addProduct}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Додати продукт
          </button>
        </div>

        {selectedProducts.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-2 mt-4">Обрані продукти:</h2>
            <ul className="space-y-3">
              {selectedProducts.map((p) => (
                <li key={p.productId} className="flex items-center gap-3">
                  <span className="flex-1">{p.name}</span>
                  <input
                    type="number"
                    min={1}
                    placeholder="Вага (г)"
                    className="w-24 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={p.weight === "" ? "" : p.weight}
                    onChange={(e) => updateWeight(p.productId, Number(e.target.value))}
                  />
                  <button
                    type="button"
                    onClick={() => removeProduct(p.productId)}
                    className="text-red-600 hover:text-red-800 font-bold"
                    aria-label={`Видалити продукт ${p.name}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Зберегти страву
        </button>
      </form>
    </div>
  );
};

export default DishesAdd;

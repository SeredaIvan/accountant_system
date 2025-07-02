"use client";

import { useRef, useState } from "react";
import * as z from "zod/v4";
import { MessageBox } from "@/components/MessageBox";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const LoginSchema = z.object({
    phone: z
      .string()
      .regex(/^(\+380\d{9}|0\d{9})$/, "Телефон має бути у форматі +380XXXXXXXXX або 0XXXXXXXXX"),
    password: z.string().min(1, "Пароль обов'язковий"),
  });

  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const labelPhoneRef = useRef<HTMLLabelElement>(null);
  const labelPassRef = useRef<HTMLLabelElement>(null);

  const [formErrors, setFormErrors] = useState<string[] | null>(null);
  const [serverMessages, setServerMessages] = useState<{ msgs: string[]; type: "error" | "success" } | null>(null);

  const resetErrors = () => {
    setFormErrors(null);
    setServerMessages(null);

    labelPhoneRef.current?.classList.remove("text-red-500");
    phoneRef.current?.classList.remove("border-red-500");
    labelPhoneRef.current!.textContent = "Телефон";

    labelPassRef.current?.classList.remove("text-red-500");
    passwordRef.current?.classList.remove("border-red-500");
    labelPassRef.current!.textContent = "Пароль";
  };

  const submitData = async (e: React.FormEvent) => {
    e.preventDefault();

    resetErrors();

    const phone = phoneRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    const result = LoginSchema.safeParse({ phone, password });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const errorMessages = Object.values(errors).flatMap((arr) => arr || []);
      setFormErrors(errorMessages);

      if (errors.phone) {
        labelPhoneRef.current?.classList.add("text-red-500");
        phoneRef.current?.classList.add("border-red-500");
        labelPhoneRef.current!.textContent = errors.phone[0]!;
      }

      if (errors.password) {
        labelPassRef.current?.classList.add("text-red-500");
        passwordRef.current?.classList.add("border-red-500");
        labelPassRef.current!.textContent = errors.password[0]!;
      }

      return;
    }

    try {
      const res = await fetch("/api/v1.0/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerMessages({ msgs: [data.error || "Сталася помилка сервера"], type: "error" });
      } else {
        setServerMessages({ msgs: ["Успішний вхід!"], type: "success" });
        router.push("/");
      }
    } catch (error) {
      setServerMessages({ msgs: ["Помилка мережі або сервера"], type: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submitData} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Ввійти в кабінет</h1>

        <MessageBox messages={formErrors} type="error" />
        <MessageBox messages={serverMessages?.msgs || null} type={serverMessages?.type || "error"} />

        <div className="flex flex-col space-y-1">
          <label ref={labelPhoneRef} htmlFor="phone" className="text-gray-700">Телефон</label>
          <input
            id="phone"
            name="phone"
            ref={phoneRef}
            placeholder="Введіть номер телефону"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label ref={labelPassRef} htmlFor="password" className="text-gray-700">Пароль</label>
          <input
            id="password"
            name="password"
            type="password"
            ref={passwordRef}
            placeholder="Введіть пароль"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Увійти
        </button>
      </form>
    </div>
  );
}

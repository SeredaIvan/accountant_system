"use client";

import { useRef, useState } from "react";
import * as z from "zod/v4";
import { MessageBox } from "@/components/MessageBox";

export default function AddUserPage() {
  const RegisterSchema = z.object({
    name: z.string().min(1, "Ім'я обов'язкове"),
    phone: z
      .string()
      .regex(
        /^(\+380\d{9}|0\d{9})$/,
        "Телефон має бути у форматі +380XXXXXXXXX або 0XXXXXXXXX"
      ),
    password: z.string().min(1, "Пароль обов'язковий"),
    role: z
      .string()
      .refine((val) => ["ADMIN", "ACCOUNTANT", "TEACHER"].includes(val), {
        message: "Оберіть правильну роль",
      }),
  });

  const [formErrors, setFormErrors] = useState<string[] | null>(null);
  const [serverMessages, setServerMessages] = useState<{ msgs: string[]; type: "error" | "success" } | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLSelectElement>(null);

  const labelNameRef = useRef<HTMLLabelElement>(null);
  const labelPhoneRef = useRef<HTMLLabelElement>(null);
  const labelPassRef = useRef<HTMLLabelElement>(null);
  const labelRoleRef = useRef<HTMLLabelElement>(null);

  const resetErrorStyles = () => {
    [labelNameRef, labelPhoneRef, labelPassRef, labelRoleRef].forEach((label) =>
      label.current?.classList.remove("text-red-500")
    );
    [nameRef, phoneRef, passwordRef, roleRef].forEach((input) =>
      input.current?.classList.remove("border-red-500")
    );

    labelNameRef.current!.textContent = "Ім'я";
    labelPhoneRef.current!.textContent = "Телефон";
    labelPassRef.current!.textContent = "Пароль";
    labelRoleRef.current!.textContent = "Роль";

    setFormErrors(null);
    setServerMessages(null);
  };

  const submitData = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrorStyles();

    const name = nameRef.current?.value || "";
    const phone = phoneRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    const role = roleRef.current?.value || "";

    const result = RegisterSchema.safeParse({ name, phone, password, role });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      const errorMessages = Object.values(errors).flatMap((arr) => arr || []);
      setFormErrors(errorMessages);

      if (errors.name) {
        labelNameRef.current?.classList.add("text-red-500");
        nameRef.current?.classList.add("border-red-500");
        labelNameRef.current!.textContent = errors.name[0]!;
      }
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
      if (errors.role) {
        labelRoleRef.current?.classList.add("text-red-500");
        roleRef.current?.classList.add("border-red-500");
        labelRoleRef.current!.textContent = errors.role[0]!;
      }

      return;
    }

    try {
      const res = await fetch("/api/v1.0/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password, role }),
        credentials: "include", 
      });

      const data = await res.json();

      if (!res.ok) {
        setServerMessages({ msgs: [data.error || "Сталася помилка"], type: "error" });
      } else {
        setServerMessages({ msgs: ["Користувача успішно додано!"], type: "success" });
        nameRef.current!.value = "";
        phoneRef.current!.value = "";
        passwordRef.current!.value = "";
        roleRef.current!.value = "";
      }
    } catch (error) {
      setServerMessages({ msgs: [`Помилка при надсиланні: ${error}`], type: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={submitData}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-4"
      >

        <MessageBox messages={formErrors} type="error" />

        <MessageBox messages={serverMessages?.msgs || null} type={serverMessages?.type || "error"} />

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Додати користувача
        </h1>

        <div className="flex flex-col space-y-1">
          <label ref={labelNameRef} htmlFor="name" className="text-gray-700">
            Ім'я
          </label>
          <input
            id="name"
            name="name"
            ref={nameRef}
            placeholder="Введіть ім'я"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label ref={labelPhoneRef} htmlFor="phone" className="text-gray-700">
            Телефон
          </label>
          <input
            id="phone"
            name="phone"
            ref={phoneRef}
            placeholder="Введіть номер телефону"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label ref={labelPassRef} htmlFor="password" className="text-gray-700">
            Пароль
          </label>
          <input
            id="password"
            name="password"
            type="password"
            ref={passwordRef}
            placeholder="Введіть пароль"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label ref={labelRoleRef} htmlFor="role" className="text-gray-700">
            Роль
          </label>
          <select
            id="role"
            name="role"
            ref={roleRef}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Оберіть роль</option>
            <option value="ADMIN">Адміністратор</option>
            <option value="ACCOUNTANT">Бухгалтер</option>
            <option value="TEACHER">Викладач</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Додати
        </button>
      </form>
    </div>
  );
}

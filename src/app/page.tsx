
import authOptions from "@/configs/nextAuthConfig";
import { getServerSession } from "next-auth";
import Image from "next/image";

export default async function Home() {
  const session =await getServerSession(authOptions)
  const user =session?.user;
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {user?.name && (
          <p className="text-lg font-semibold text-center text-gray-800">
            Вітаємо, {user.name}! Роль {user.role ||"квористувач"}
          </p>
          
        )}
      </main>
    </div>
  );
}

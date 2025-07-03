import { Dish } from "@/generated/prisma";
import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body=await req.json();
  
  const {name ,product , weight }=body as Partial<Dish>
  console.log(name, product, weight);
  if(!name || !product ||!weight){
    return NextResponse.json({error:"Поля всі мають бути заповнені"},{status:400});
  }

  try{
    const dish = await prisma.dish.create({
      data:{
        name:name,
        product:product,
        weight:weight
      }
    })
    return NextResponse.json(dish,{status:201})
  }
  catch(error){
     console.error("DB error:", error);
    return NextResponse.json({error:"Помилка додавання страви"},{status:500})
  }

}

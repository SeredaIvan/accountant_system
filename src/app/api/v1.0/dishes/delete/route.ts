import { Dish } from "@/generated/prisma";
import { prisma } from "@/lib/prismaClient";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  
  const body =  await req.json();
  
  const {id}=body as Partial<Dish>
  console.log(id)
  if(!id){
    return NextResponse.json({error:"Потрібно id"},{status:400})
  } 

  try{
    const dish = await prisma.dish.delete({
      where:{
        id:id
      }
    })
    if(!dish){
      return NextResponse.json({error:"Страва не найдена"},{status:404})

    }
    return NextResponse.json({message:"Страву видалено"},{status:200})
  }
  catch(error){
    console.log("DB ERR",error)
    return NextResponse.json({error:"Помилка видалення страви"},{status:500})
  }

}
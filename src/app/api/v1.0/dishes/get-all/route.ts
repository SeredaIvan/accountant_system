import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
  try{
    const dishes = await prisma.dish.findMany()
    if(!dishes){
      return NextResponse.json({error:"Немає страв"},{status:404})
    }
    return NextResponse.json({dishes:dishes},{status:200})
  }
  catch(error){
    return NextResponse.json({error:error},{status:500})
  }
}
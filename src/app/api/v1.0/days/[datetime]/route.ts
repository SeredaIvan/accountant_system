import { prisma } from "@/lib/prismaClient";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { datetime: string } }
) {
  const { datetime } = await params;


  const [day, month, year] = datetime.split("-").map(Number);
  
  
  if (!day || !month || !year) {
    return NextResponse.json({ error: "Невірна дата" }, { status: 400 });
  }
  try {
  const dayData =await prisma.day.findFirst({
    where: {
      date: new Date(year, month-1,day)
    },
    include:{
      dishes:true
    }
  })

  if(!dayData){
   return NextResponse.json({error:"Дня не знайдено"},{status:404})
  }

  return NextResponse.json({dayData:dayData},{status:200});
}catch(error){
  return NextResponse.json({error:error},{status:200});
}
}

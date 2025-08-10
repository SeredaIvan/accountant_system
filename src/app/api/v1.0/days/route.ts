import { Day, DayDish, Dish } from "@/generated/prisma"
import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import  _, { set }  from "lodash";

type DayPatchPayload = Omit<Day, "createdAt" | "updatedAt"> & { dishes: Omit<DayDish, "dayId"|"createdAt" | "updatedAt">[] };

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, countKids, dishes}: DayPatchPayload = body as DayPatchPayload;

  if (!id) {
    return NextResponse.json({ error: "Потрібно id" }, { status: 400 });
  }

  try {
    const dayData = await prisma.day.update({
      where: { id },
      data: {
        countKids
      },
    });
    const dishesInDB = [{id:"4",dishId:"3"},{id:"2",dishId:"6"},{id:"3",dishId:"9"}]/*await prisma.dayDish.findMany( 
      {where:{
        dayId:dayData.id
      },
      select:{
        id : true,
        dishId:true
      }
    })*/
    
    console.log(difference(dishes,dishesInDB,"id"))


    return NextResponse.json({ dayData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Помилка оновлення" + error }, { status: 500 });
  }
}
function difference<T>(arr1:T[], arr2:T[],key:keyof T){
  const setKeys = new Set(arr2.map(item=>item[key]))
  console.log(arr1)
  const difference= arr1.filter(item=>{
    setKeys.has(item[key])
  })
  console.log(difference)
  return difference
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { date, countKids }: Omit<DayPatchPayload, "id"> = body;
  console.log(date)
  try {
    const dayData = await prisma.day.create({
      data: {
        date: new Date(date),
        countKids
      }
    });

    return NextResponse.json({ dayData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Помилка створення" }, { status: 500 });
  }
}

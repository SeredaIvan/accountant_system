import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import  {prisma} from "@/lib/prismaClient";
import { User } from "@/generated/prisma";
import { error } from "console";

export async function POST(req: NextRequest,res:NextResponse) {
  const {phone,password} =await req.json()
  if(!phone || !password){
    return NextResponse.json({error: "Пароль і телефон обов'язкові"}, {status:400})
  }
  try{
    const user:User = prisma.user.find.first({
      where : {
        phone: phone
      }
    })
    if(!user){
      return NextResponse.json({error : "Користувача за цим телефоном не знайдено "}, {status:404})
    }
    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid){
        return NextResponse.json({error: "Невірний пароль "},{status:400})
    }
    const {password: _ , ...userWithoutPass}=user
    

  }
  catch(error){

  }
    
}
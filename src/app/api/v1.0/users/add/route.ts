import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
export async function GET(req: NextRequest) {

}
export async function POST(req: NextRequest,res:NextResponse) {
  const body =await req.json()
  const  {name,phone,role,password} = body
  if (!name || !phone || !role || !password){
    return NextResponse.json({error:"Всі поля обов'язкові"},{status:400})
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try{
      const user = await prisma.user.create({
        data:{
          name:name,
          phone:phone,
          role:role,
          password:hashedPassword
        }
      })
      if(!user){
        return NextResponse.json({error:"Не вдалось створити користувача"},{status:500})
      }
      else{
        const secret:string|undefined =process.env.JWT_SECRET
        if(typeof secret!=="string"){
           return NextResponse.json({error:"Проблема з jwt"},{status:500})
        } 
        const token = jwt.sign({id:user.id,phone:user.phone}, secret,{expiresIn : "1d"})
        const {password : _ , ...userWithoutPass}=user
        return NextResponse.json({user :{},token:token})
      }
  }
  catch(error){

  }
}
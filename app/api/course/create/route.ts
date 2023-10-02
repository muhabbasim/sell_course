

import { db } from "@/lib/prisma_client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  
  try {
  
    const { userId } = auth();
    const { title } = await req.json() 
  
    if(!userId) return new NextResponse("Unauthorized", { status: 200 });
    const course = await db.course.create({
      data: {
        title,
        userId
      }
    })
    return NextResponse.json(course , { status: 200 });
    
  } catch (error) {

    console.log(error)
    return NextResponse.json({ message: "Server Error!!" }, { status: 500 })
  }
} 

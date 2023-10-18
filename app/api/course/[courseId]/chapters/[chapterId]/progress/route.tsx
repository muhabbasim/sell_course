import { db } from "@/lib/prisma_client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const PUT = async (req: Request, { params }: { params: { courseId: string; chapterId: string }}) => {
  
  try {
    
    const { courseId, chapterId } = params;
    const { isCompleted } = await req.json();
    
    const { userId } = auth();

    if(!userId) return new NextResponse("Unutherized", { status: 401 });

    const userProgress = await db.userProgress.upsert({ // (upsert) for updating or creating new one 
      // update if we have it already
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        }
      },
      update: {
        isCompleted
      },
      // create if we do not have it 
      create:{
        userId,
        chapterId,
        isCompleted
      }
    })

    return new NextResponse(JSON.stringify(userProgress), { status: 200 });
    
  } catch (error) {

    console.log('{COURSE_ID', error)
    return new NextResponse("Internet Error", { status: 500 })
  }
}
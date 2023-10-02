     
import Course from "@/models/course";
import { db } from "@/lib/prisma_client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { courseId: string }}) => {

  try {

    const values = await req.json();
    const { courseId } = params
    const { userId } = auth();
    
    if(!userId) return new NextResponse("Unutherized", { status: 401 });

    const course = await db.course.update({
      where: {
        id: courseId,
        userId
      },
      data: {
        ...values,
      }
    });
    

    return new NextResponse(JSON.stringify(course), { status: 200 });
    
  } catch (error) {

    console.log('{COURSE_ID', error)
    return new NextResponse("Internet Error", { status: 500 })
  }
} 
     
import { db } from "@/lib/prisma_client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const PUT = async (req: Request, { params }: { params: { courseId: string }}) => {

  try {

    const { list } = await req.json();
    const { courseId } = params
    const { userId } = auth();
    
    if(!userId) return new NextResponse("Unutherized", { status: 401 });

    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId
      }
    });

    if(!ownCourse) return new NextResponse("Unutherized", { status: 401 });

    for ( let item of list ) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position}
      });
    }
    return new NextResponse("Successfull update", { status: 200 });
    
  } catch (error) {

    console.log('{COURSE_ID', error)
    return new NextResponse("Internet Error", { status: 500 })
  }
} 
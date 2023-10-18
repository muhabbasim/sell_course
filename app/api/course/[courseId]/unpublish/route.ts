import { db } from "@/lib/prisma_client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// creat a chapter
export const PATCH = async (req: Request, { params }: { params: { courseId: string; chapterId: string }}) => {
  
  try {

    const { courseId } = params
    const { userId } = auth();

    if(!userId) return new NextResponse("Unutherized", { status: 401 });

    // to make sure the user is the owner of the course
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId
      }
    });

    if(!courseOwner) return new NextResponse("Unutherized", { status: 401 });

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId
      }
    })

    if(!course) return new NextResponse("Course not found", { status: 401 });



    const unPublishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId
      },
      data: {
        isPublished: false
      }
    })

    return new NextResponse(JSON.stringify(unPublishedCourse), { status: 200 });
    
  } catch (error) {

    console.log('{COURSE_ID', error)
    return new NextResponse("Internet Error", { status: 500 })
  }
} 

``
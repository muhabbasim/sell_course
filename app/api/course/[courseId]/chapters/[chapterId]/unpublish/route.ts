import { db } from "@/lib/prisma_client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// creat a chapter
export const PATCH = async (req: Request, { params }: { params: { courseId: string; chapterId: string }}) => {

  try {
    const { courseId, chapterId } = params
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

    const unpublishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId
      },
      data: {
        isPublished: false
      }
    })

    // check if the chapter is the only unpublished chapter in the course if so then unpublish the course
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true
      }
    })

    if(!publishedChaptersInCourse.length) {
       
      await db.course.update({
        where:{
          id: courseId,
          userId
        },
        data: {
          isPublished: false
        }
      })
    }
    
    return new NextResponse(JSON.stringify(unpublishedChapter), { status: 200 });
    
  } catch (error) {

    console.log('{COURSE_ID', error)
    return new NextResponse("Internet Error", { status: 500 })
  }
} 


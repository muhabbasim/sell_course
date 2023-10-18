import { db } from "@/lib/prisma_client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// creat a chapter
export const PATCH = async (req: Request, { params }: { params: { courseId: string; chapterId: string }}) => {

  try {

    // const { isPublished, ...value}  = await req.json();
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

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId
      }
    })

    const musData = await db.muxData.findUnique({
      where: {
        chapterId
      }
    })

    if(!musData || !chapter || !chapter.title || !chapter.videoUrl || !chapter.description ) {
      return new NextResponse("All fields are required", { status: 401 });
    }

    const publishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId
      },
      data: {
        isPublished: true
      }
    })

    return new NextResponse(JSON.stringify(publishedChapter), { status: 200 });
    
  } catch (error) {

    console.log('{COURSE_ID', error)
    return new NextResponse("Internet Error", { status: 500 })
  }
} 


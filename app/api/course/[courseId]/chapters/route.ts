import { db } from "@/lib/prisma_client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


// creat a chapter
export const POST = async (req: Request, { params }: { params: { courseId: string }}) => {

  try {

    const { title } = await req.json();
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

    // set a postion for the chapter 
    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId
      },
      orderBy: {
        position: 'desc'
      }
    })

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        courseId,
        position: newPosition,
      }
    });
    

    return new NextResponse(JSON.stringify(chapter), { status: 200 });
    
  } catch (error) {

    console.log('{COURSE_ID', error)
    return new NextResponse("Internet Error", { status: 500 })
  }
} 
     
import { db } from "@/lib/prisma_client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from '@mux/mux-node'

// for mux site access
const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_SECRET_KEY!
)

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


// delete course
export const DELETE = async (req: Request, { params }: { params: { courseId: string }}) => {

  try {

    const { courseId } = params
    const { userId } = auth();
    
    if(!userId) return new NextResponse("Unutherized", { status: 401 });

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId
      },
      include: {
        chapters: {
          include: {
            muxData: true
          }
        }
      }
    });

    if(!course) return new NextResponse("Course not found", { status: 404 });

    // map throw the course chapters and delete the muxData from MUX website
    for( const chapter of course.chapters ) {
      if( chapter?.muxData?.assetId ) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }
    // the musData and the chapter will be deleted automatically couse of cascading permission 

    const deletedCourse = await db.course.delete({
      where: {
        id: courseId,
        userId
      }
    })

    return new NextResponse(JSON.stringify(deletedCourse), { status: 200 });
    
  } catch (error) {

    console.log('Error', error)
    return new NextResponse("Internet Error", { status: 500 })
  }
} 
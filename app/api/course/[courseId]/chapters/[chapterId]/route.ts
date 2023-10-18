import { db } from "@/lib/prisma_client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from '@mux/mux-node'

// for mux site access
const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_SECRET_KEY!
)

// creat a chapter
export const PATCH = async (req: Request, { params }: { params: { courseId: string; chapterId: string }}) => {

  try {

    const { isPublished, ...values}  = await req.json();
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

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId
      },
      data: {
        ...values
      }
    })

    // process the chapter video
    if(values.videoUrl) {
      const exixtingMuxData = await db.muxData.findFirst({
        where: {
          chapterId
        }
      })

      if(exixtingMuxData) {
        await Video.Assets.del(exixtingMuxData.assetId) // delete from mux site
        await db.muxData.delete({  // delete from database
          where:{
            id: exixtingMuxData.id
          }
        })
      }

      // upload the video to mux site
      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false,
      })
      
      // create a muxData
      await db.muxData.create({
        data: {
          chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id
        }
      })
    }

    return new NextResponse(JSON.stringify(chapter), { status: 200 });
    
  } catch (error) {

    console.log('{COURSE_ID', error)
    return new NextResponse("Internet Error", { status: 500 })
  }
} 

// delete chapter
export const DELETE = async (req: Request, { params }: { params: { courseId: string; chapterId: string }}) => {

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

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId
      },
    })
    // console.log("Chapter :", chapter)


    if(!chapter) return new NextResponse("Chapter not found", { status: 404 });


    if(chapter.videoUrl) {
      const exixtingMuxData = await db.muxData.findFirst({
        where: {
          chapterId
        }
      })
      

      if(exixtingMuxData) {
        await Video.Assets.del(exixtingMuxData.assetId) // delete from mux site
        await db.muxData.delete({  // delete from database
          where:{
            id: exixtingMuxData.id
          }
        })

      }
    }



    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId
      }
    })


    // unpublished the course if this happend to be the only published chpater in the course 
    // first check for the published chapters in the course 
    
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true
      }
    })
    
    // if there is no other published chapters update the course
    if(!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
          userId
        },
        data: {
          isPublished: false
        }
      })
    }

    return new NextResponse(JSON.stringify(deletedChapter), { status: 200 });
    
  } catch (error) {

    console.log('{Chapter_ID', error)
    return new NextResponse("Internet Error", { status: 500 })
  }
} 


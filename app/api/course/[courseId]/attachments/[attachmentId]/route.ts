import { db } from "@/lib/prisma_client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


// deleting an attachment
export const DELETE = async (req: Request, { params }: { params: { attachmentId: string, courseId: string }}) => {

  try {

    const { attachmentId, courseId } = params
    const { userId } = auth();

    if(!userId) return new NextResponse("Unutherized", { status: 401 });

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId
      }
    })

    if(!courseOwner) {
      return new NextResponse("Unutherized not the owner", { status:401 });
    }

    await db.attachments.delete({
      where: {
        id: attachmentId,
        courseId
      }
    })
   
    return new NextResponse(JSON.stringify("Attachment deleted successfully"), { status: 200 });
    
  } catch (error) {

    return new NextResponse("Internet Error", { status: 500 })
  }
} 
import { db } from "@/lib/prisma_client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// creating an attachment
export const POST = async (req: Request, { params }: { params: { courseId: string }}) => {

  try {

    const { url } = await req.json();
    const { courseId } = params
    const { userId } = auth();
    
    if(!userId) return new NextResponse("Unutherized", { status: 401 });

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId
      }
    })
    if(!courseOwner) {
      return new NextResponse("Unutherized Not the owner", { status:401 });
    }

    const attachment = await db.attachments.create({
      data: {
        url,
        courseId,
        name: url.split('/').pop(),
      }
    });
    

    return new NextResponse(JSON.stringify(attachment), { status: 200 });
    
  } catch (error) {

    return new NextResponse("Internet Error", { status: 500 })
  }
} 

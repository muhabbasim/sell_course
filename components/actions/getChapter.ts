import { db } from "@/lib/prisma_client";
import { Attachments, Chapter } from "@prisma/client"


type getChapterProps = {
  userId: string;
  courseId: string;
  chapterId: string;
};


export const getChapter = async ({
  userId,
  courseId,
  chapterId
}: getChapterProps) => {

  try {

    const purchase = await db.purchese.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      select: {
        price: true,
      }
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true
      }
    });

    if(!chapter || !course) {
      throw new Error("Chapter or course not found");
    }
    

    let muxData = null;
    let attachments: Attachments[] = [];
    let nextChapter: Chapter | null = null;

    if(purchase) {
      attachments = await db.attachments.findMany({
        where: {
          courseId
        }
      });
    }

    if(chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId
        }
      });

      nextChapter = await db.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: {
            gt: chapter?.position // position greater than the current chapter first one
          }
        },
        orderBy: {
          position: 'asc'
        }
      })
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId
        }
      }
    })

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase
    }


  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
}
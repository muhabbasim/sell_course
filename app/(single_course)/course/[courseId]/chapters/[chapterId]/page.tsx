import { Banner } from '@/components/Banner';
import { getChapter } from '@/components/actions/getChapter';
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React from 'react'
import VideoPlayer from './_components/VideoPlayer';
import CourseEnrollButton from './_components/CourseEnrollButton';
import { Separator } from '@/components/ui/separator';
import Preview from '@/components/Preview';
import CourseProgressButton from './_components/CourseProgressButton';

export default async function SingleChapterPage({ params }: { params: { courseId: string, chapterId: string } }) {

  const { userId } = auth();
  const courseId = params.courseId
  const chapterId = params.chapterId
  if(!userId) redirect("/");

  const {
    chapter,
    course,
    muxData,
    attachments,
    userProgress,
    purchase,
    nextChapter
  } = await getChapter({ courseId, chapterId, userId })

  if(!chapter|| !course) return redirect("/")

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  
  return (
    <div className='w-full'>
      {userProgress?.isCompleted && (
        <Banner
          variant='success'
          label='You already completed this purchase'
        />
      )}

      {isLocked && (
        <Banner
          variant='warning'
          label='You need to purchase this course to watch this chapter'
        />
      )}

      <div className='flex flex-col pb-20 xl:flex-row'>
        <div className='w-full p-4'>
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id!}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>

        <div>
          <div className='p-4 flex flex-col md:flex-row items-center justify-between'>
            <h2 className='text-2xl font-semibold mb-2 xl:min-w-[200px]'>
              {chapter.title}
            </h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={chapterId}
                courseId={courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={courseId}
                price={course.price!}
              />
            )}
          </div>

          <Separator/>

          <div>
            <Preview
              value={chapter.description!}
            />
          </div>

          {!!attachments.length && (
            <>
              <Separator/>
              <div className='p-4'>
                {attachments.map((attachment) => (
                  <a 
                    href={attachment.url}
                    target='_blank'
                    key={attachment.id}
                    className='flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline'
                  >
                    <p>
                      {attachment.name}
                    </p>
                  </a>
                ))}
              </div>

            </>
          )}
        </div>
      </div>

    </div>
  )
}

import { db } from '@/lib/prisma_client';
import { auth } from '@clerk/nextjs';
import { ArrowLeft, LayoutDashboardIcon, Video } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ChapterTitleForm from './_components/ChapterTitleForm';
import ChapterDescriptionForm from './_components/ChapterDescriptionForm';
import ChapterAccessForm from './_components/ChapterAccessForm';
import ChapterVideoForm from './_components/ChapterVideoForm';
import { Banner } from '@/components/Banner';
import ChapterActions from './_components/ChapterActions';

export default async function ChapterIdPage( 
{ params }: {
  params: { chapterId: string; courseId: string } 
  // (courseId) should match the [courseId] folder
}) {
   
  const { userId } = auth();
  const chapterId = params.chapterId
  const courseId = params.courseId

  if(!userId) return redirect('/');

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId
    },
    include: {
      muxData: true
    }
  })

  if(!chapter) return redirect('/');

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl
  ];
  
  const totalFields = requiredFields.length;
  const compeletedFields = requiredFields.filter(Boolean).length;
  const compeletionText =`(${compeletedFields} / ${totalFields})`
  const isCompelete = requiredFields.every(Boolean) // all reqiuired fields are compeleted

  return (
    <>
    {!chapter.isPublished ? (
      <Banner
        variant="warning"
        label='This chapte is not published. It will not be visible in the course'
      />
    ) : (
      <Banner
        variant="success"
        label='This chapte is published.'
      />
    )}
      <div className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='w-full'>
            <Link 
              className='flex items-center text-sm hover:opacity-75 transition mb-6'
              href={`/teacher/courses/${courseId}`}
            >
              <ArrowLeft className='h-4 w-4 mr-2'/>
              Back to course setups
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                  Chapter Creation
                </h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {compeletionText}
                </span>
              </div>

              <ChapterActions
                disabled={!isCompelete}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          <div className='space-y-4'>
            <div>
              <div className='flex items-center gap-x-2'>
                <div className='bg-sky-100 rounded-[50%] p-2'>
                  <LayoutDashboardIcon color="#106c94" size={31}/>
                </div>
                <h2 className='text-lg'>
                  Customize your chapter
                </h2>
              </div>
              <ChapterTitleForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
              <ChapterDescriptionForm 
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>

            <div>
              <div className='flex items-center gap-x-2'>
                <div className='bg-sky-100 rounded-[50%] p-2'>
                  <LayoutDashboardIcon color="#106c94" size={31}/>
                </div>
                <h2 className='text-lg'>
                  Access Settings
                </h2>
              </div>

              <ChapterAccessForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
          </div>

          <div>
            <div>
              <div className='flex items-center gap-x-2'>
                <div className='bg-sky-100 rounded-[50%] p-2'>
                  <Video color="#106c94" size={31}/>
                </div>
                <h2 className='text-lg'>
                  Add Video
                </h2>
              </div>

              <ChapterVideoForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

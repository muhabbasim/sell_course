import { db } from '@/lib/prisma_client';
import { auth } from '@clerk/nextjs';
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react';
import { redirect } from "next/navigation";
import React from 'react'
import TitleForm from './_components/TitleForm';
import DescriptionForm from './_components/DescriptionForm';
import ImageForm from './_components/ImageForm';
import CategoryForm from './_components/CategoryForm';
import PriceForm from './_components/PriceForm';
import AttachmentForm from './_components/AttachmentForm';
import ChaptersForm from './_components/ChaptersForm';
import { Banner } from '@/components/Banner';
import CourseActions from './_components/CourseActions';


export default async function CouseIdPage( 
{ params }: {
  params: { courseId: string} 
  // (courseId) should match the [courseId] folder
}) {

  const { userId } = auth();
  const courseId = params.courseId

  if (!userId) {
    redirect("/")
  }

  // get course
  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId,
    },

    include: {
      chapters: {
        orderBy: {
          position: "asc"
        }
      },
      attachments: {}
    }
  })

  // get categories
  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })


  if (!course) {
    redirect("/")
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageURL,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];
  

  const totalField = requiredFields.length;
  // when field is not filled it gonna return null 
  const compeletedFields = requiredFields.filter(Boolean).length;
  const compeletionText = `(${compeletedFields}/${totalField})`
  const isComplete = requiredFields.every(Boolean);
  
  return (
    <>
      {!course.isPublished ? (
        <Banner
          label='This course is not published. It will not be visible to the students'
          variant='warning'
        />
        ) : (
        <Banner
          label='This course is published.'
          variant='success'
        />
      )}
      <div className='p-6'>
        <div className='flex items-center justify-between'>  
          <div  className='flex flex-col gap-y-2'>
            <h1 className='text-2xl font-medium'>
              Course setup
            </h1>
            <span className='text-sm text-slate-700'>
              Compelete all fields {compeletionText}
            </span>
          </div>

          <CourseActions
            disabled={!isComplete}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          <div>
            <div className='flex items-center gap-x-2'>
              <div className='bg-sky-100 rounded-[50%] p-2'>
                <LayoutDashboard color="#106c94" size={31}/>
              </div>
              <h2 className='text-lg'>
                Customize your course
              </h2>
            </div>

            <TitleForm 
              initialData={course}
            />
            <DescriptionForm 
              initialData={course}
            />
            <ImageForm 
              initialData={course}
            />
            <CategoryForm
              initialData={course} 
              options={categories.map((category) => ({
                label: category.name,
                value: category.id
              }))}
            />

            
          </div> 

          <div className='space-y-6'>
            <div>
              <div className='flex items-center gap-x-2'>
                <div className='bg-sky-100 rounded-[50%] p-2'>
                  <ListChecks color="#106c94" size={31}/>
                </div>
                <h2 className='text-lg'>
                  Course chapters
                </h2>
              </div>
              
              <ChaptersForm 
                initialData={course}
              />
            </div>

            <div>
              <div className='flex items-center gap-x-2'>
                <div className='bg-sky-100 rounded-[50%] p-2'>
                  <CircleDollarSign color="#106c94" size={31}/>
                </div>
                <h2 className='text-lg'>
                  Sell your course
                </h2>
              </div>

              <PriceForm
                initialData={course}
              />
            </div>
            <div>
              <div className='flex items-center gap-x-2'>
                <div className='bg-sky-100 rounded-[50%] p-2'>
                  <File color="#106c94" size={31}/>
                </div>
                <h2 className='text-lg'>
                  Resources & Attachments
                </h2>
              </div>

              <AttachmentForm 
                initialData={course}
              />

            </div>
          </div>
        </div>
      </div>
    </>

  )
}


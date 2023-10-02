import { db } from '@/lib/prisma_client';
import { auth } from '@clerk/nextjs';
import { LayoutDashboard, LucideIcon } from 'lucide-react';
import { redirect } from "next/navigation";
import React from 'react'
import TitleForm from './_components/TitleForm';
import DescriptionForm from './_components/DescriptionForm';
import ImageForm from './_components/ImageForm';


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

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId,
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
  ];
  

  const totalField = requiredFields.length;
  // when field is not filled it gonna return null 
  const compeletedFields = requiredFields.filter(Boolean).length;
  const compeletionText = `(${compeletedFields}/${totalField})`
  
  return (
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
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
        <div>
          <div className='flex items-center gap-x-2'>
            <div className='bg-sky-100 rounded-[50%] p-2'>
              <LayoutDashboard color="#106c94" size={31}/>
            </div>
            <h2 className='text-xl'>
              Customize your course
            </h2>
          </div>

          <TitleForm initialData={course}/>
          <DescriptionForm initialData={course}/>
          <ImageForm initialData={course}/>
        </div>
      </div>
    </div>
  )
}


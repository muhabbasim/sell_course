import CourseList from '@/components/CourseList';
import { getDashboardCourses } from '@/components/actions/getDashboardCourses';
import { auth } from '@clerk/nextjs'
import { CheckCircle, Clock } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'
import InfoCard from './_components/InfoCard';

export default async function Dashboard() { 

  const { userId } = auth();
  if(!userId) return redirect('/')

  const {
    completedCourses,
    coursesInProgress
  } = await getDashboardCourses(userId);

  return (
    <div className='p-6 space-y-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <InfoCard
          Icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
          color="#106c94"
        />
        <InfoCard
          Icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          color="rgb(5 150 105)"
        />
      </div>
      <CourseList
        items={[...coursesInProgress, ...completedCourses]}
      />
    </div>
  )
}

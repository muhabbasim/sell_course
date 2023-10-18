import { db } from '@/lib/prisma_client'
import React from 'react'
import Categories from './_components/Categories'
import SearchInput from '@/components/SearchInput'
import { getCourses } from '@/components/actions/getCources'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import CourseList from '@/components/CourseList'

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {

  const { userId } = auth()
  if(!userId) return redirect('/')

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    }
  })

  const courses = await getCourses({ userId, ...searchParams})
  
  return (
    <>
      <div className='px-6 py-6 md:hidden block'>
        <SearchInput/>
      </div>

      <div className='p-6 space-y-4 flex flex-col'>
        <Categories
          items={categories}
        />

        <CourseList items={courses}/>
      </div>
    </>

  )
}
 
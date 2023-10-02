import CourseList from '@/components/CourseList'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/prisma_client'
import Link from 'next/link'

export default async function Courses() {

  const courses = await db.course.findMany()

  return (
    <div className='p-6'>
      <Link href="/teacher/create">
        <Button variant={'secondary'}>
          New Course
        </Button>
      </Link>

      <CourseList courses={courses} />
    </div>
  )
}

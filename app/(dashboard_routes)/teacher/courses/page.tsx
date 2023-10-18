import { db } from '@/lib/prisma_client'
import { DataTable } from './_components/DataTable'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { columns } from './_components/Columns'

export default async function Courses() {

  
  const { userId } = auth();
  if(!userId) return redirect("/")
  
  const courses = await db.course.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className='p-6'>
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

import { db } from '@/lib/prisma_client';
import { redirect } from 'next/navigation';


export default async function SingleCoursePage({ params }: { params: { courseId: string } }) {
  
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc"
        }
      }
    }
  });

  if(!course) return redirect("/");

  // redirect to the first chapter in the course
  return redirect(`/course/${course.id}/chapters/${course.chapters[0].id}`)
}

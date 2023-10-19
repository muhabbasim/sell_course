import { db } from "@/lib/prisma_client";
import { Category, Chapter, Course } from "@prisma/client"
import { getProgress } from "./getProgress";


type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {

  try {
    const purchasedCourses = await db.purchese.findMany({
      where: {
        userId
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              }
            }
          }
        }
      }
    })


    const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];

    for( let course of courses ) {
      const progress = await getProgress(userId, course.id)
      course["progress"] = progress
      // course.progress = progress // works too

      
    }

    const completedCourses = courses.filter((course) => course.progress === 100);
    const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);  // (course.progress ?? 0) meaning in case of progress is null count it as 0
    // const coursesInProgress = courses.filter((course) => course.progress !== 100); // works too but wont cover | null

    return {
      completedCourses,
      coursesInProgress
    }
  } catch (error) {
    console.log("[GET_DAHSBOARD_COURSES]", error)
    return {
      completedCourses: [],
      coursesInProgress: [],
    }
  }
}
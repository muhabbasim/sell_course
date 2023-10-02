import CourseCard from "./CourseCard"


type CourseProps = {
  courses: any
}

export default function CourseList({ courses }: CourseProps) {


  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        { courses?.map((course: any) => {
          return (

            <CourseCard 
              key={course.id} 
              course={course}
              
            />
          )
        })}
      </div>

      {courses?.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
    </div>
  )
}

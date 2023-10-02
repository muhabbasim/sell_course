import React from 'react'

// interface courseProps {
//   title: string
// }

export default function CourseCard({course}: any) {
  return (
    <div>
    <span>{course.title}</span>
  </div>
  )
}

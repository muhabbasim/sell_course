"use client"
import ConfirmModal from "@/components/modals/ConfirmModal"
import { Button } from "@/components/ui/button"
import { UseConfettiStore } from "@/hooks/use_confetti_store"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

interface CourseActionsProps {
  disabled: boolean
  courseId: string
  isPublished: boolean | null;
}

function CourseActions({ disabled, courseId, isPublished }: CourseActionsProps) {
  
  const [isLoading, setIisLoading] = useState(false);
  const router = useRouter()

  const confetti = UseConfettiStore();

  const onPublishCourse = async () => {
    try {
      
      setIisLoading(true)

      if(isPublished) {
        await axios.patch(`/api/course/${courseId}/unpublish`);
        toast.success('Course unpublished')
      } else {
        await axios.patch(`/api/course/${courseId}/publish`);
        toast.success('Course published')
        confetti.onOpen();
      }
     
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIisLoading(false)
    }
  }

  const onDelete = async () => {

    try {
      setIisLoading(true)
      await axios.delete(`/api/course/${courseId}`);
      toast.success('Course deleted successfully')
      router.refresh();
      router.push(`/teacher/courses`)
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIisLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
        onClick={onPublishCourse}
      >
        {!isPublished ? "Published" : "Unpublished"}
      </Button>

      <ConfirmModal 
        isLoading={isLoading}
        onConfirm={onDelete}
      /> 
    </div>
  )
}

export default CourseActions
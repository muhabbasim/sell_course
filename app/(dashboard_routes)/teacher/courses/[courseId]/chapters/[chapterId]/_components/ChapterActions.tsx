"use client"
import ConfirmModal from "@/components/modals/ConfirmModal"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

interface ChapterActionsProps {
  disabled: boolean
  courseId: string
  chapterId: string
  isPublished: boolean
}

function ChapterActions({ disabled, courseId, chapterId, isPublished }: ChapterActionsProps) {
  
  const [isLoading, setIisLoading] = useState(false);
  const router = useRouter()

  const onPublisChapter = async () => {
    try {
      
      setIisLoading(true)

      if(isPublished) {
        await axios.patch(`/api/course/${courseId}/chapters/${chapterId}/unpublish`);
        toast.success('Chapter unpublished')
      } else {
        await axios.patch(`/api/course/${courseId}/chapters/${chapterId}/publish`);
        toast.success('Chapter published')
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
      await axios.delete(`/api/course/${courseId}/chapters/${chapterId}`);
      toast.success('Chapter deleted')
      router.refresh();
      router.push(`/teacher/courses/${courseId}`)
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
        onClick={onPublisChapter}
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

export default ChapterActions
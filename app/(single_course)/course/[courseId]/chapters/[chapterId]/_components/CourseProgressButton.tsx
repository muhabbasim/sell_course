"use client"

import { Button } from "@/components/ui/button"
import { UseConfettiStore } from "@/hooks/use_confetti_store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
}

export default function CourseProgressButton({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId
}: CourseProgressButtonProps) {

  const [ isLoading, setIsLoading ] = useState(false);
  const router = useRouter();
  const confetti = UseConfettiStore(); 

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const res = await axios.put(`/api/course/${courseId}/chapters/${chapterId}/progress`, {
        isCompleted: !isCompleted
      })

      if(!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if(!isCompleted && nextChapterId) {
        router.push(`/course/${courseId}/chapters/${nextChapterId}`)
      }

      toast.success("Progress updated")
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false);
    }
  }

  const ButtonIcon = isCompleted ? XCircle : CheckCircle

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      type="button"
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto xl:min-w-[190px]"
    >
      {isCompleted ? "Not completed" : "Mark as complete"}
      <ButtonIcon className="h-4 w-4 ml-2" />
    </Button>
  )
}

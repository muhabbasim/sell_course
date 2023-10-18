"use client"

import * as z from "zod"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { toast } from "sonner"
import {  Pencil, PlusCircle, VideoIcon } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Chapter, MuxData } from "@prisma/client"
import FileUpload from "@/components/FileUpload"

import MuxPlayer from "@mux/mux-player-react"


interface ChapterVideoFormProps {
  initialData: Chapter & { muxData: MuxData | null }
  chapterId: string
  courseId: string
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
})


export default function ChapterVideoForm({ initialData, chapterId, courseId }: ChapterVideoFormProps) {
  
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current)
  const submitForm = async (values: z.infer<typeof formSchema>) => {

    try {
      const res = await axios.patch(`/api/course/${courseId}/chapters/${chapterId}`, values)
      toast.success('Video updated')
      console.log(res)
      toggleEdit();
      router.refresh();
      
    } catch (error) {
      toast.error('something went wrong')
    }
  }
  

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter Video
        <Button onClick={toggleEdit} variant={"ghost"}>
          { isEditing && <>Cancel</> }
          { !isEditing && !initialData?.videoUrl && <><PlusCircle className="h-4 w-4 mr-2"/> Add video</> }
          { !isEditing && initialData?.videoUrl && <><Pencil className="h-4 w-4 mr-2"/>Edit video</> }
        </Button>
      </div>

      { !isEditing && (
        !initialData?.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500"/>
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer
              playbackId={initialData?.muxData?.playbackId || ""}
            />
          </div>
        )
      )}

      { isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVidoe"
            onChange={(url) => {
              if (url) {
                submitForm({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload chapter video
          </div>
        </div>
      )}

      { !isEditing && initialData?.videoUrl && (
        <p className="mt-4" >
          videos can take few minute to process. refresh the page if video does not appear.
        </p>
      )}

    </div>
  )
}


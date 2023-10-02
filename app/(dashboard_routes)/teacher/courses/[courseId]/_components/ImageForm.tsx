"use client"

import * as z from "zod"
import { Button } from "@/components/ui/button"
import axios from "axios"
import toast from "react-hot-toast"
import { ImageIcon, Pencil, PlusCircle } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Course } from "@prisma/client"
import FileUpload from "@/components/FileUpload"



interface ImageFormProps {
  initialData: Course
}

const formSchema = z.object({
  imageURL: z.string().min(2, {
    message: "image is required",
  }),
})


export default function ImageForm({initialData}: ImageFormProps) {
  
  const [isEditing, setIsEditing] = useState(false)
  const courseId = initialData.id
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current)
  const submitForm = async (values: z.infer<typeof formSchema>) => {

    try {
      await axios.patch(`/api/course/${courseId}`, values)
      toast.success('Image updated')
      toggleEdit();
      router.refresh();
      
    } catch (error) {
      toast.error('something went wrong')
    }
  }
  

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Course Images
        <Button onClick={toggleEdit} variant={"ghost"}>
          { isEditing && <>Cancel</> }
          { !isEditing && !initialData?.imageURL && <><PlusCircle className="h-4 w-4 mr-2"/> Add image</> }
          { !isEditing && initialData?.imageURL && <><Pencil className="h-4 w-4 mr-2"/>Edit image</> }
        </Button>
      </div>

      { !isEditing && (
        !initialData?.imageURL ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500"/>
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              src={initialData?.imageURL}
              className="object-cover rounded-md"
            />
          </div>
        )
      )}

      { isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                submitForm({ imageURL: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}

    </div>
  )
}


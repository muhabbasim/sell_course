"use client"

import * as z from "zod"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { toast } from "sonner"
import {  File, Loader2, PlusCircle, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Attachments, Course } from "@prisma/client"
import FileUpload from "@/components/FileUpload"



interface AttachmentFormProps {
  initialData: Course & { attachments: Attachments[] } // relationship to the attachment
}

const formSchema = z.object({
  url: z.string().min(1),
})


export default function AttachmentForm({initialData}: AttachmentFormProps) {
  
  const [isEditing, setIsEditing] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const courseId = initialData.id
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  // creating attachments function 
  const submitForm = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/course/${courseId}/attachments`, values)
      toast.success('Attachments updated')
      toggleEdit();
      router.refresh();
      
    } catch (error) {
      toast.error('something went wrong')
    }
  }

  // deleting attachments function
  const onDelete = async (id: string) => {
    
    try {
      setDeletingId(id);
      await axios.delete(`/api/course/${courseId}/attachments/${id}`);
      toast.success('Attachment deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setDeletingId(null);
    }
  }
  

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Course Attachments
        <Button onClick={toggleEdit} variant={"ghost"}>
          { isEditing && <>Cancel</> }
          { !isEditing && <><PlusCircle className="h-4 w-4 mr-2"/> Add a file</> }
        </Button>
      </div>

      { !isEditing  &&
        <> 
          { initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No Attactments
            </p>
          )}

          { initialData.attachments.length > 0 && (
            <div className="space-y-2">
              { initialData.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                  >
                    <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                    <p className="text-xs line-clamp-1">
                      { attachment.name}
                    </p>
                    { deletingId === attachment.id && (
                      <div>
                        <Loader2 className="h-4 w-4 animate-spin"/>
                      </div>
                    )}

                    { deletingId !== attachment.id && (
                      <button
                        className="ml-auto hover:opacity-75 transition"
                        onClick={()=> onDelete(attachment.id)}
                      >
                        <X className="h-4 w-4 "/>
                      </button>
                    )}
                  </div>
                ))
              }
            </div>
          )}
        </>
      }

      { isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment" // from the uploadthing core.ts
            onChange={(url) => {
              if (url) {
                submitForm({ url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Your students need for the course
          </div>
        </div>
      )}

    </div>
  )
}


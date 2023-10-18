"use client"

 
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import axios from "axios"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Chapter } from "@prisma/client"
import { toast } from "sonner"
import Editor from "@/components/Editor"
import Preview from "@/components/Preview"



interface ChapterDescriptionFormProps {
  initialData: Chapter
  chapterId: string
  courseId: string
}

const formSchema = z.object({
  description: z.string().min(1)
})


export default function ChapterDescriptionForm({ initialData, chapterId, courseId }: ChapterDescriptionFormProps) {
  
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    }
  })

  const { isSubmitting, isValid } = form.formState;
  // console.log(isValid)
  
  const toggleEdit = () => setIsEditing((current) => !current)
  const submitForm = async (values: z.infer<typeof formSchema>) => {

    try {
      await axios.patch(`/api/course/${courseId}/chapters/${chapterId}`, values)
      toast.success('Chapter description updated')
      toggleEdit();
      router.refresh();
      
    } catch (error) {
      toast.error('something went wrong')
    }
  }
  

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter Description
        <Button onClick={toggleEdit} variant={"ghost"}>
          { isEditing ? 
            "Cancel" : (
              <>
                <Pencil className="h-4 w-4 mr-2"/> Edit Description
              </>
            )}
        </Button>
      </div>

      { !isEditing && (
        <div className={cn("text-sm mt-2", !initialData.description && "text-slate-500")}>
          {!initialData.description && "No description"}
          {initialData.description && (
            <Preview
              value={initialData.description}
            />
          )}
        </div>
      )}

      { isEditing && (
        <Form {...form}>

          <form
            onSubmit={form.handleSubmit(submitForm)}
            className="space-y-4 mt-5"
          >

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose the course description
                  </FormDescription>
                  <FormMessage/> 
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Save
              </Button>
            </div>

          </form>
        </Form>
      )}

    </div>
  )
}




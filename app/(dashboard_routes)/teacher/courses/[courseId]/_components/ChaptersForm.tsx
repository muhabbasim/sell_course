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
import { Loader2, Pencil } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Chapter, Course } from "@prisma/client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import ChaptersList from "./ChaptersList"



interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] }
}

const formSchema = z.object({
  title: z.string().min(1),
})


export default function ChaptersForm({initialData}: ChaptersFormProps) {
  
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const courseId = initialData.id
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    }
  })

  const { isSubmitting, isValid } = form.formState;
  // console.log(isValid)
  
  const toggleCreating = () => {
    setIsCreating((current) => !current)
  }
  
  const submitForm = async (values: z.infer<typeof formSchema>) => {

    try {
      await axios.post(`/api/course/${courseId}/chapters`, values)
      toast.success('Chapter created')
      toggleCreating();
      router.refresh();
      
    } catch (error) {
      toast.error('something went wrong')
    }
  }

  const onReorder = async (updateDate: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true)
      await axios.put(`/api/course/${courseId}/chapters/reorder`, { list: updateDate })
      toast.success("Chpaters reordered")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsUpdating(false)
    }
  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`)
  }
  

  return (
    <div className=" relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700"/>
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Course Chapters
        <Button onClick={toggleCreating} variant={"ghost"}>
          { isCreating ? 
            "Cancel" : (
              <>
                <Pencil className="h-4 w-4 mr-2"/> Add a chapter
              </>
            )}
        </Button>
      </div>

      { isCreating && (
        <Form {...form}>

          <form
            onSubmit={form.handleSubmit(submitForm)}
            className="space-y-4 mt-5"
          >

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'introduction'"
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
            
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              Create
            </Button>
          </form>
        </Form>
      )}

      { !isCreating && (
        <div className={cn("text-sm mt-2", !initialData.chapters.length && "text-slate-500 italic")}>
          {!initialData.chapters.length && "No Chapters"}

          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters}
          />
        </div>
      )}

      { !isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder chapters
        </p>
      )}

    </div>
  )
}




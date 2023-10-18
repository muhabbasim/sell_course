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
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import axios from "axios"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Chapter } from "@prisma/client"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"



interface ChapterAccessFormProps {
  initialData: Chapter
  chapterId: string
  courseId: string
}

const formSchema = z.object({
  isFree: z.boolean().default(false)
})


export default function ChapterAccessForm({ initialData, chapterId, courseId }: ChapterAccessFormProps) {
  
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: Boolean(initialData?.isFree)
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
        Chapter access settings
        <Button onClick={toggleEdit} variant={"ghost"}>
          { isEditing ? 
            "Cancel" : (
              <>
                <Pencil className="h-4 w-4 mr-2"/> Edit Accesss
              </>
            )}
        </Button>
      </div>

      { !isEditing && (
        <p className={cn("text-sm mt-2", !initialData.isFree && "text-slate-500")}>
          {!initialData.isFree && "This chapter is not free"}
          {initialData.isFree && (
           "This chapter is free"
          )}
        </p>
      )}

      { isEditing && (
        <Form {...form}>

          <form
            onSubmit={form.handleSubmit(submitForm)}
            className="space-y-4 mt-5"
          >

            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    <FormDescription>
                      check to make this chpater free for preview!
                    </FormDescription>
                  </div>
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




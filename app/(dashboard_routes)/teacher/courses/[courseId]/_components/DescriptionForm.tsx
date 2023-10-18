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
import { Textarea } from "@/components/ui/textarea"
import { Course } from "@prisma/client"
import { toast } from "sonner"



interface DescriptionFormProps {
  initialData: Course
}

const formSchema = z.object({
  description: z.string().min(2, {
    message: "Description is required",
  }),
})


export default function DescriptionForm({initialData}: DescriptionFormProps) {
  
  const [isEditing, setIsEditing] = useState(false)
  const courseId = initialData.id
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
      const response = await axios.patch(`/api/course/${courseId}`, values)
      toast.success('Description updated')
      toggleEdit();
      router.refresh();
      
    } catch (error) {
      toast.error('something went wrong')
    }
  }
  

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Course Description
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
        <p className={cn("text-sm mt-2", !initialData.description && "text-slate-500")}>
          {initialData.description || "No description"}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g. 'This course is about ...'"
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




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
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import axios from "axios"
import toast from "react-hot-toast"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"



interface TitleFormProps {
  initialData: {
    title: string;
    id: string;
  }
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required",
  }),
})


function TitleForm({ initialData }: TitleFormProps) {


  const [isEditing, setIsEditing] = useState(false)
  const courseId = initialData.id
  // console.log(initialData)
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => setIsEditing((current) => !current)
  const submitForm = async (values: z.infer<typeof formSchema>) => {

    try {
      const response = await axios.patch(`/api/course/${courseId}`, values)
      toast.success('Title updated')
      toggleEdit();
      router.refresh();
      
    } catch (error) {
      toast.error('something went wrong')
    }
  }
  

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Course Title
        <Button onClick={toggleEdit} variant={"ghost"}>
          { isEditing ? 
            "Cancel" : (
              <>
                <Pencil className="h-4 w-4 mr-2"/> Edit Title
              </>
            )}
        </Button>
      </div>

      { !isEditing && (
        <p>
          {initialData.title}
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
             name="title"
             render={({ field }) => (
               <FormItem>
                 <FormControl>
                   <Input
                     disabled={isSubmitting}
                     placeholder="e.g. 'marketing techniques'"
                     {...field}
                   />
                 </FormControl>
                 <FormDescription>
                   Choose the course title
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

export default TitleForm
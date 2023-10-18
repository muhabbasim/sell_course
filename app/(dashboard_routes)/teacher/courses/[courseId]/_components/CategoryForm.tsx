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
import { toast } from "sonner"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Course } from "@prisma/client"
import { Combobox } from "@/components/Combobox"



interface CategoryFormProps {
  initialData: Course
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1),
})


export default function CategoryForm({ initialData, options }: CategoryFormProps) {
  
  const [isEditing, setIsEditing] = useState(false)
  const courseId = initialData.id
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
    }
  })

  const { isSubmitting, isValid } = form.formState;

  const selectedOption = options.find((option) => option.value === initialData.categoryId)  

  const toggleEdit = () => setIsEditing((current) => !current)
  const submitForm = async (values: z.infer<typeof formSchema>) => {

    try {
      const response = await axios.patch(`/api/course/${courseId}`, values)
      toast.success('Category updated')
      toggleEdit();
      router.refresh();
      
    } catch (error) {
      toast.error('something went wrong')
    }
  }
  

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Course Category
        <Button onClick={toggleEdit} variant={"ghost"}>
          { isEditing ? 
            "Cancel" : (
              <>
                <Pencil className="h-4 w-4 mr-2"/> Edit Category
              </>
            )}
        </Button>
      </div>

      { !isEditing && (
        <p className={cn("text-sm mt-2", !initialData.categoryId && "text-slate-500")}>
          {selectedOption?.label || "No category"}
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={...options}
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


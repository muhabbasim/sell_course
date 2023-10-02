"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from 'axios'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import toast from "react-hot-toast"


const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is reequired",
  }),
})

export default function Create() {
  
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  const { isSubmitting, isValid } = form.formState;

  const submitForm = async (values: z.infer<typeof formSchema>) => {

    try {
      const response = await axios.post('/api/course/create', values)

      router.push(`/teacher/courses/${response.data.id}`)
      toast.success("Course created successfully")
      
      console.log(response)
      
    } catch (error) {
      toast.error('something went wrong')
    }
  }
  


  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6 ">
      <div className="border shadow-sm px-20 py-8 rounded "> 

        <h1 className="text-2xl">
          Name your course
        </h1>
        <p className="text-sm text-slate-600">
          Make sure to give a compalling and attractive name to your course 
        </p>

        <Form {...form}>

          <form
            onSubmit={form.handleSubmit(submitForm)}
            className="space-y-8 mt-8"
          >

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Course title
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'marketing techniques'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What the course is about
                  </FormDescription>
                  <FormMessage/> 
                </FormItem>
              )}
            />

              <div className="flex items-center gap-x-2">
                <Link href="/teacher/courses">
                  <Button
                    type="button"
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                </Link>

                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                >
                  Continue
                </Button>
              </div>

          </form>
        </Form>
      </div>

    </div>
  )
}

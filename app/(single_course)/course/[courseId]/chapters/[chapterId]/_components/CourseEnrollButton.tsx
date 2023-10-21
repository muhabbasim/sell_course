"use client"
import PriceFormat from "@/components/PriceFormat";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}

export default function CourseEnrollButton({
  courseId, 
  price
}: CourseEnrollButtonProps) {

  const [ isLoading, setIsLoading ] = useState(false)

  const handlePurchase = async () => {
    try {
      setIsLoading(true)
      const res = await axios.post(`/api/course/${courseId}/checkout`)
      window.location.assign(res.data.url)

    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePurchase}
      disabled={isLoading}
      size="sm"
      className="w-full md:w-auto xl:min-w-[190px]"
    >
      Enroll for {PriceFormat(price)}
    </Button>
  )
}

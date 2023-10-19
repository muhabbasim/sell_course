import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  numberOfItems: number;
  color?: string;
  label: string;
  Icon: LucideIcon
}

export default function InfoCard({
  numberOfItems,
  color,
  label,
  Icon
}: InfoCardProps) {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
      <div className='flex items-center gap-x-2'
        >
        <div className='bg-sky-100 rounded-[50%] p-1'>
          <Icon color={color} size={30}/>
        </div>
        <div className='font-medium'>
          <p className="">
            {label}
          </p>
          <p className="text-gray-500 text-sm">
            {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
          </p>
        </div>
      </div>
    </div>
  )
}

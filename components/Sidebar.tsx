import Image from 'next/image'
import React from 'react'
import SidebarRoutes from './SidebarRoutes'
import { Tv2 } from 'lucide-react'


export default function Sidebar() {
  return (
    <div className='h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm'>
      <div className='text-sky-700 p-6 flex justify-center gap-2'>
        <Tv2 />
        <h2 className=' text-sky-700 font-[700]'>Sell Courses</h2>
      </div>
      <div>
        <SidebarRoutes />
      </div>
    </div>
  )
}

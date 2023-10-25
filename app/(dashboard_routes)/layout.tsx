"use client"


import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import React from 'react'

import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

const queryClient = new QueryClient()


export default function layout({children} : {
  children: React.ReactNode
}) {

  
  return (
    <QueryClientProvider client={queryClient}>
      <div className='h-full flex'>
        <div className='h-[80px] md:pl-72 fixed inset-y-0 w-full z-50'>
          <Navbar/>
        </div>
        <div className='hidden fixed md:flex h-full flex-col inset-y-0 z-50'>
          <Sidebar/>
        </div>
        <main className='h-full pt-[80px] md:pl-80 w-full'>
          {children}
        </main>
      </div>
    </QueryClientProvider>
  )
}


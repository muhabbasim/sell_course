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
        <div className='h-[80px] md:pl-[250px] fixed w-full z-50'>
          <Navbar/>
        </div>
        <div className='hidden md:flex h-full w-[350px] flex-col inset-y-0 z-50'>
          <Sidebar/>
        </div>
        <main className='h-full pt-[80px] w-full'>
          {children}
        </main>
      </div>
    </QueryClientProvider>
  )
}

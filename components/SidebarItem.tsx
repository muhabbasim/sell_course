"use client"

import { LucideIcon } from 'lucide-react'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'


interface SidebarItemProps {
  icon: LucideIcon
  label: string
  href: string
}

export default function SidebarItem({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) {

  const router = useRouter()
  const pathname = usePathname()

  const isActive = (pathname === '/' && href === '/') ||
    pathname === href ||
    pathname?.startsWith(`${href}/`)
  ;

  const handleClick = () => {
    router.push(href)
  }

  return (

    <div
      onClick={handleClick}
      className={cn(
        "w-auto cursor-pointer flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive && "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-500",
            isActive && "text-sky-700"
          )}
        />
        {label}
      </div>

      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-14 transition-all",
          isActive && "opacity-100"
        )}
      />
    </div>
   

  )
}

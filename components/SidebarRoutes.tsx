"use client"

import { BarChart, Compass, Layout, List } from 'lucide-react'
import React from 'react'
import SidebarItem from './SidebarItem';
import { usePathname } from 'next/navigation';

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/"
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search"
  },
];

const creatorRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses"
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics"
  },
]

export default function SidebarRoutes() {

  const pathname = usePathname();

  const isTeacherMode = pathname?.includes('/teacher');
  const routes = isTeacherMode ? creatorRoutes : guestRoutes

  return (
    <div className='flex flex-col'>
      { routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  )
}

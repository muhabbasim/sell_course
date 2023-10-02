"use client"

import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function NavbarRoutes() {

  const pathname = usePathname();

  const isCreatorPage = pathname?.startsWith('/teacher');
  const isPlayerPage = pathname?.includes('/chapter');
  return (

    <div className="flex items-center gap-x-4 ml-auto">

      { isCreatorPage || isPlayerPage ? (
        <Link href="/">
          <Button variant={"ghost"}>
            <LogOut className="h-4 w-4 mr-2"/>
            Exit
          </Button>
        </Link>
      ) : (
        <Link href="/teacher/courses">
          <Button size='sm' variant={"outline"}>
          Creator Mode
          </Button>
        </Link>
      ) }  


      <UserButton
        afterSignOutUrl="/"
      />
    </div>
  )
}

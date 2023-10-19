"use client"

import { UserButton, auth, useAuth } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./SearchInput";

export default function NavbarRoutes() {

  const pathname = usePathname();
  const { userId } = useAuth();

  const isCreatorPage = pathname?.startsWith('/teacher');
  const isPlayerPage = pathname?.includes('/course');
  const isSearchPage = pathname === '/search';


  return (
    <>
      { isSearchPage && (
        <div className="hidden md:block">
          <SearchInput/>
        </div>
      )}
      
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
        )}  

        <UserButton
          afterSignOutUrl="/"
        />
      </div>
    </>


  )
}

import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"
import Sidebar from './Sidebar'


export default function MobileSidebar() {
  return (
    <div className='md:hidden'>
      <Sheet>
        <SheetTrigger aria-controls="radix-:R1mcq:">
          <Menu/>
        </SheetTrigger>
        <SheetContent side="left" className='w-[300px] p-0'>
          <SheetClose>
            <Sidebar/>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </div>
  )
}

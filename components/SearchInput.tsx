"use client"

import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { SearchIcon } from 'lucide-react'
import { useDebounce } from '@/hooks/use_debounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string'

export default function SearchInput() {

  const [value, setValue] = useState("");
  const debounceValue = useDebounce(value);

  const searchParams =  useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const currentCategoryId = searchParams.get('categoryId');

  useEffect(() => {
    const url = queryString.stringifyUrl({
      url: pathName,
      query: {
        categoryId: currentCategoryId,
        title: debounceValue
      }
    }, {skipEmptyString: true, skipNull: true})

    router.push(url)
  },[debounceValue, currentCategoryId, router, pathName])

  return (
    <div className='relative'>
      <SearchIcon className='h-4 w-4 absolute top-3 left-3 text-slate-600'/>
      <Input
        className='w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200'
        placeholder='Search for a course...'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}

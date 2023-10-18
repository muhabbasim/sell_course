"use client"

import { Category } from "@prisma/client"
import { IconType } from 'react-icons'
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSportsMode
} from "react-icons/fc";
import CategoryItem from "./CategoryItem";


interface CategoriesProps {
  items: Category[]
}

const iconMap: Record<Category["name"], IconType> = {
  "Music": FcMusic,
  "Fitness": FcSportsMode,
  "Photography": FcOldTimeCamera,
  "Engineering": FcEngineering,
  "Programming": FcMultipleDevices,
  "Filming": FcFilmReel,
}
 
export default function Categories({ items }: CategoriesProps) {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      { items.map((category) => (
        <CategoryItem
          key={category.id}
          label={category.name}
          icon={iconMap[category.name]}
          value={category.id}
        />
      ))}
    </div>
  ) 
}

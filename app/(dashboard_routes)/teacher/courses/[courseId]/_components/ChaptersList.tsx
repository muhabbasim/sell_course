"use client"
import { Chapter } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { 
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd';
import { Grip, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';


interface ChaptersFormProps {
  items: Chapter[];
  onEdit: (id: string) => void;
  onReorder: (updateDate : { id: string; position: number }[]) => void;
}


function ChaptersList({ items, onEdit, onReorder }: ChaptersFormProps) {

  const [isMounted, setisMounted] = useState(false)
  const [cahpters, setCahpters] = useState(items);

  useEffect(() => {
    setisMounted(true);
  }, [])
  
  useEffect(() => {
    setCahpters(items);
  }, [items])


  const onDragEnd = (result: DropResult) => {
    if(!result.destination) return;

    const items = Array.from(cahpters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);
    
    setCahpters(items);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id)
    }))

    onReorder(bulkUpdateData);
  } 

  if(!isMounted) return null;
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='chapters'>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {cahpters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div 
                    className={cn("flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      chapter.isPublished && "bg-sky-100 botder-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div 
                      className={cn("px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transtion",
                        chapter.isPublished&& "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip 
                        className='h-5 w-5'
                      />
                    </div>
                    {chapter.title}

                    <div  className='ml-auto pr-2 flex items-center gap-x-2'>   
                      {chapter.isFree && (
                        <Badge variant="secondary">
                          Free
                        </Badge>
                      )}
                      <Badge
                        className={cn('bg-slate-500', chapter.isPublished && "bg-sky-700")}
                      >
                        {chapter.isPublished ? "Puplished" : "Draft"}
                      </Badge>
                      <Pencil
                      className='w-4 h-4 cursor-pointer hover:opacity-75 transition'
                        onClick={() => onEdit(chapter.id)}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default ChaptersList 
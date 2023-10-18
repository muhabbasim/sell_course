"use client"

import { UseConfettiStore } from "@/hooks/use_confetti_store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

export default function VideoPlayer({
  playbackId, courseId, chapterId, nextChapterId, isLocked, completeOnEnd, title

}: VideoPlayerProps) {

  const [ isReady, setIsReady ] = useState(false);
  const router = useRouter();
  const confetti = UseConfettiStore();

  const onVideoEnd = async () => {

    try {

      if(completeOnEnd) {
        await axios.put(`/api/course/${courseId}/chapters/${chapterId}/progress`,{
          isCompleted: true 
        })
      }

      if(!nextChapterId) {
        confetti.onOpen();
      }
      toast.success('Progress updated')
      router.refresh();

      if(nextChapterId) {
        router.push(`/course/${courseId}/chapters/${nextChapterId}`)
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }


  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8"/>
          <p className="text-sm">
            This chapter is locked
          </p>
        </div>
      )}

      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onVideoEnd}
          // autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  )
}

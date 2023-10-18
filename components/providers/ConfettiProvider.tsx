"use client"

import ReactConfetti from "react-confetti"
import { UseConfettiStore } from "@/hooks/use_confetti_store"


function ConfettiProvider() {

  const confetti = UseConfettiStore();
  if(!confetti.isOpen) return null;

  return (
    <ReactConfetti
      className="pointer-events-none z-[100]"
      numberOfPieces={700}
      recycle={false}
      onConfettiComplete={() => {
        confetti.onClose();
      }}
    >

    </ReactConfetti>
  )
}

export default ConfettiProvider
import React, { useRef } from "react"
import { useDrop } from "react-dnd"

interface DropTargetProps {
  onDrop: (id: string) => void
}

const DropTarget: React.FC<DropTargetProps> = ({ onDrop }) => {
  const ref = useRef(null)

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "answer",
    drop: (item: any) => {
      onDrop(item.id)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div
      ref={ref}
      {...drop}
      className={`drop-target ${isOver ? "is-over" : ""}`}
    />
  )
}

export default DropTarget

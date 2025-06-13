import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, useRef } from 'react'
import Avatar from '@/components/common/Avatar'

export default function SortableTask({ card, setSelectedCard, task, openTaskDetail }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: "task-"+task.id })

  const [isDragging, setIsDragging] = useState(false)
  const timerRef = useRef(null)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'pointer'
  }

  const handleMouseDown = (e) => {
    timerRef.current = setTimeout(() => {
      setIsDragging(true)
    }, 100)
  }

  const handleMouseUp = (e) => {
    clearTimeout(timerRef.current)
    if (!isDragging) {
      openTaskDetail(task) // This is a real click, not drag
      setSelectedCard(card)
      // console.log(card)
    }
    setIsDragging(false)
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={style}
      className="p-2 border rounded text-white bg-secondary  mb-2"
    >
      <div className='d-flex'>
        {task.done ? (
            <i className="far fa-check-circle text-info py-1 pe-1"></i>
        ) : (
            <i className="far fa-check-circle text-light py-1 pe-1"></i>
        )}
        <span>{task.title}</span>
      </div>
      {/* <div className='d-flex'>
        <div className='row'>
          <div className='col-12'>
            <div className="d-flex align-items-center justify-content-start mt-2">
              { 
                task?.members?.map((memberEmail, index) => (<Avatar email={memberEmail} /> 
              ))}
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { deleteBoard } from '@/services/boardService'

export default function BoardCard({ id, name, description, retrieveAllBoards, setName, setDescription, showForm, setShowForm, editBoard, setEditBoard, children }) {
  const [hover, setHover] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation() // ngăn link click

    const confirmDelete = window.confirm('Are you sure you want to delete this board?')
    if (!confirmDelete) return

    setLoading(true)
    try {
      const res = await deleteBoard(id)
      if (res && res.status==200) {
        toast.success('Board deleted successfully')
        setName('')
        setDescription('')
        retrieveAllBoards() 
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const showUpdate = async (name, description) => {
    setShowForm(true)
    setEditBoard(id)
    setName(name)
    setDescription(description)
  }

  return (
    <div className="position-relative">
      <Link href={`/boards/${id}`} passHref>
        <div
          className="card position-relative"
          style={{ width: '200px', height: '140px', cursor: loading ? 'not-allowed' : 'pointer' }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {hover && !loading && (
            <>
              <button
                className="position-absolute btn btn-sm btn-primary py-0 px-1"
                style={{ top: '5px', right: '30px' }}
                onClick={(e)=> { e.preventDefault(); showUpdate(name, description)}}
                aria-label="Update board"
                disabled={loading}
              >
                <i className='fas fa-pencil' />
              </button>
              <button
                className="position-absolute btn btn-sm btn-danger py-0 px-1"
                style={{ top: '5px', right: '5px' }}
                onClick={handleDelete}
                aria-label="Delete board"
                disabled={loading}
              >
                <i className='fas fa-times' />
              </button>
            </>
          )}

          
          <div className="card-body p-2">
            <h5 className="card-title m-0">{name}</h5>
            <p
              className="card-text mb-0"
              style={{
                fontSize: '0.85rem',
                color: '#555',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {description}
            </p>
          </div>
        </div>
      </Link>
      
      {editBoard && children}
    
    </div>
  )
}

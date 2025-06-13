'use client'
import React, { useEffect, useState, useRef } from 'react'
import BoardCard from '@/components/BoardCard'
import withAuth from '@/utils/withAuth'
import { toast } from 'react-toastify';
import Link from 'next/link'
import Loading from '@/components/common/Loading'
import NoData from '@/components/common/NoData'
import { listBoards, createBoard, detailBoard, updateBoard} from '@/services/boardService'
import BoardForm from '@/components/BoardForm'

function TrelloDashboard() {
    const [boards, setBoards] = useState([])
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const formRef = useRef()
    const [editBoard, setEditBoard] = useState(null)

    useEffect(() => {
        retrieveAllBoards()
    }, [])

    const retrieveAllBoards = async () => {
        setLoading(true)
        try {
            const res = await listBoards()
            if (res && res.status==200) {
                setBoards(res.data)
            }
        } catch (err) {
            console.error(err)
            toast.error(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }
      
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
            formRef.current && !formRef.current.contains(event.target)
            ) {
            setShowForm(false)
            setEditBoard(null)
            setName(null)
            setDescription(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
    
    const handleCreate = async () => {
        if (!name.trim()) return alert('Nhập tên board')
        setLoading(true)
        try {
        const res = await createBoard(name, description)
          if(res && res.status==201) {
            toast.success('Created successfully!')
            setShowForm(false)
            setName('')
            setDescription('')
            retrieveAllBoards()
          }
            
        } catch (err) {
            console.log(err)
        } finally {
          setLoading(false)
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        setLoading(true)
        try {
        const res = await updateBoard(editBoard, name, description)
        if (res && res.status==200) {
            toast.success('Board update successfully')
            retrieveAllBoards() 
            setEditBoard(null)
            setShowForm(false)
            setName('')
            setDescription('')
        }
        } catch (err) {
        toast.error(err.message)
        } finally {
        setLoading(false)
        }
    }

    return (
        <div className="container">
            <div className="row">
                {/* Sidebar */}
                <div className="col-3 text-white min-vh-100 p-3">
                    <div className="nav flex-column">

                        <div className="nav-item mb-2">
                            <a href="#" className="nav-link d-flex align-items-center active text-white bg-secondary rounded px-3 py-2">
                                <i className="fa fa-bar-chart me-2"></i>
                                Boards
                            </a>
                        </div>

                        <div className="nav-item">
                            <a href="#" className="nav-link d-flex align-items-center text-white px-3 py-2">
                                <i className="fa fa-users me-2"></i>
                                All Members
                            </a>
                        </div>

                    </div>
                </div>

                {/* Main */}
                <div className="col-md-9">
                    <h5 className="mt-3 mb-3">Your Workspaces</h5>
                    <div className="d-flex flex-wrap gap-3 position-relative">
                        {loading && <Loading />}
                        

                        {boards.map((board) => {
                            const isEditing = editBoard === board.id && showForm
                            return (
                                <BoardCard 
                                    key={board.id} 
                                    id={board.id} 
                                    name={board.name} 
                                    description={board.description} 
                                    retrieveAllBoards={retrieveAllBoards}
                                    setName={setName}
                                    setDescription={setDescription}
                                    showForm={showForm}
                                    setShowForm={setShowForm}
                                    editBoard={editBoard}
                                    setEditBoard={setEditBoard}
                                >
                                    {isEditing && (
                                        <BoardForm
                                            ref={formRef}
                                            loading={loading}
                                            handleCreate={handleUpdate}
                                            title="Update Board"
                                            setDescription={setDescription}
                                            setName={setName}
                                            formRef={formRef}
                                            name={name}
                                            description={description}
                                        />
                                    )} 
                                </BoardCard>
                            )
                        })}
                         
                        {/* {boards.length === 0  && <NoData />} */}
                        
                        <div className={`card position-relative cardNullBoard cursor-pointer`}>
                            <div className="card-body p-2" onClick={() => {setShowForm(!showForm)}}>
                                <h6 className="card-title m-0">+ Create a new board</h6>
                            </div>

                            {showForm && !editBoard && (
                                <BoardForm
                                    loading={loading}
                                    handleCreate={handleCreate}
                                    title="Create New Board"
                                    setDescription={setDescription}
                                    setName={setName}
                                    name={name}
                                    description={description}
                                    formRef={formRef}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withAuth(TrelloDashboard)

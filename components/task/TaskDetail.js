import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Loading from '@/components/common/Loading'
import { detailTask, deleteTask, updateTask } from '@/services/taskService'
import Avatar  from '@/components/common/Avatar'
import TaskDetailDescription from '@/components/task/TaskDetailDescription'
import TaskDetailHeader from '@/components/task/TaskDetailHeader'
import TaskDetailRight from '@/components/task/TaskDetailRight'

export default function TaskDetail({closeTaskDetail, selectedTask, setSelectedTask, selectedCard, board }) {
  const [loading, setLoading] = useState(false)
  const [openFormMembers, setOpenFormMembers] = useState(false)
  const [members, setMembers] = useState([])
  
  // useEffect(() => {
  //   console.log('Updated members:', members)
  // }, [members])

  useEffect(() => {
    setMembers(selectedTask.members)
  }, [selectedTask])

  const handleDelete = async (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    const confirmDelete = window.confirm('Are you sure you want to delete this task?')
    if (!confirmDelete) return

    setLoading(true)
    try {
      const res = await deleteTask(selectedCard.boardId, selectedCard.id, id)
      if (res && res.status==200) {
        toast.success('Task deleted successfully')
        closeTaskDetail(true)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const addMemberToTask = async (email) => {
    let updatedMembers = members;

    if (!members.includes(email)) {
      updatedMembers = [...members, email];
      setMembers(updatedMembers);
    }
    setLoading(true)
    try {
      const res = await updateTask(selectedCard.boardId, selectedCard.id, selectedTask.id, { members: updatedMembers });
      if (res && res.status==200) {
        toast.success('Task is assigned successfully')
        // closeTaskDetail(true)
        console.log(res)
        setSelectedTask(res.data)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  };

  const removeMemberFromTask = async (email) => {
    const updatedMembers = members.filter((m) => m !== email);
    setMembers(updatedMembers);
    setLoading(true);
    try {
      const res = await updateTask(
        selectedCard.boardId,
        selectedCard.id,
        selectedTask.id,
        { members: updatedMembers } 
      );
      if (res && res.status === 200) {
        toast.success('Member removed successfully');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (boardId, cardId, taskId, updateFields) => {
    setLoading(true)
    try {
      const res = await updateTask(boardId, cardId, taskId, updateFields);
      if (res && res.status==200) {
        toast.success('Task is updated successfully')
        // closeTaskDetail(true)
        console.log(res)
        setSelectedTask(res.data)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className=''>
      {loading && <Loading/>}
      <div className="modal fade show d-block bg-dark bg-opacity-50" onClick={closeTaskDetail}>
        <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()} >
          <div className="modal-content bg-dark text-white p-3" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <TaskDetailHeader
              selectedCard={selectedCard}
              selectedTask={selectedTask}
              handleUpdateTask={handleUpdateTask}
              closeTaskDetail={closeTaskDetail}
            />

            <div className="row">
              
              <div className="col-md-8">
                
                <div className="d-flex align-items-center gap-2 mb-3">
                  
                  <div className="d-flex align-items-center justify-content-start">
                      <Avatar email={board.ownerEmail} />
                  </div>
                    
                  <div className="position-relative">
                    <button className="btn btn-sm btn-outline-light" onClick={()=>setOpenFormMembers(!openFormMembers)}>+ Add member</button>
                    {openFormMembers && (
                      <div className="bg-dark text-white p-2 rounded position-absolute border border-white">
                        <h6 className="mb-2">Add Member to Task</h6>
                        {board?.members?.map((memberEmail, index) => (
                          <div
                            key={index}
                            onClick={() => addMemberToTask(memberEmail)}
                            className="d-flex align-items-center justify-content-between px-2 py-1 mb-1 rounded hover-bg-secondary"
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="d-flex align-items-center">
                              <Avatar email={memberEmail} />
                              <span>{memberEmail}</span>
                            </div>
                            { members.includes(memberEmail) && 
                              <span className="text-danger ms-3" onClick={(e) => {
                                e.stopPropagation(); 
                                removeMemberFromTask(memberEmail);
                              }}>X</span>
                            }
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                  <div className="ms-auto">
                    <button className="btn btn-sm btn-outline-light">🔔 Watch</button>
                  </div>
                </div>
                
                <div className='row'>
                  <div className='col-12'>
                    <div className="d-flex align-items-center justify-content-start mb-2">
                      { 
                        members?.map((memberEmail, index) => (<Avatar email={memberEmail} /> 
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h6>Description</h6>
                  <TaskDetailDescription
                    initialValue={selectedTask.description}
                    onSave={(newDesc) => {
                      handleUpdateTask(selectedCard.boardId, selectedCard.id, selectedTask.id,  { description: newDesc })
                    }}
                  />
                </div>

                <div className="mb-2 d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Activity</h6>
                  <button className="btn btn-sm btn-outline-light">Show details</button>
                </div>
                <div className="d-flex align-items-start gap-2 mb-3">
                  <div className="px-2 py-1">
                    <Avatar email={board.ownerEmail} />
                  </div>
                  <input className="form-control bg-secondary text-white" placeholder="Write a comment"
                  />
                </div>
              </div>

              <TaskDetailRight
                selectedTask={selectedTask}
                handleDelete={handleDelete}
              />

            </div>
          </div>
        </div>
      </div>
    </div>
    

  )
}

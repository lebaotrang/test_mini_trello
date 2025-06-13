export default function AddTaskForm({openAddTaskForm, handleAddTask, setOpenAddTaskForm, setTaskTitle, taskTitle, card }) {
    return (
        openAddTaskForm == card.id
        ?
        <>
            <input
                className="form-control form-control-sm"
                placeholder="Add new task..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
            />
            <div className="d-flex justify-content-between w-100">
                <button className="btn btn-primary btn-sm" onClick={() => handleAddTask(card.id)} >
                    Add task 
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setOpenAddTaskForm(null)}>
                    Close
                </button>
            </div>
        </>
        :
        <button className="btn btn-primary btn-sm" onClick={() => {setOpenAddTaskForm(card.id)}} >
            Add task
        </button>
            
    )
}

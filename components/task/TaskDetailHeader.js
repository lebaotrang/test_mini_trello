import { useState } from 'react';

const TaskDetailHeader = ({ selectedCard, selectedTask, handleUpdateTask, closeTaskDetail }) => {
    const [title, setTitle] = useState(selectedTask.title);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [done, setDone] = useState(selectedTask.done);

    const handleDoneToggle = async () => {
        const newDone = !done;
        setDone(newDone);
        handleUpdateTask(selectedCard.boardId, selectedCard.id, selectedTask.id, { done: newDone });
    };

    const handleTitleSave = async () => {
        setIsEditingTitle(false);
        if (title !== selectedTask.title) {
            handleUpdateTask(selectedCard.boardId, selectedCard.id, selectedTask.id, { title });
        }
    };

    return (
        <div className="d-flex justify-content-between align-items-start mb-3">
            <div className='d-flex align-items-center'>

                <i className={`far fa-check-circle ${done ? 'text-info' : 'text-light'} py-1 pe-2`}
                    style={{ cursor: 'pointer', fontSize: '1.3rem' }}
                    onClick={handleDoneToggle}
                ></i>

                {!isEditingTitle 
                ? 
                (
                    <h5 className="fw-bold mb-0 text-white" onClick={() => setIsEditingTitle(true)} style={{ cursor: 'pointer' }}>
                        {title || 'Untitled'}
                    </h5>
                ) : (
                    <div className="d-flex align-items-center">
                        <input className="form-control form-control-sm me-2" autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleSave}
                            onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                        />
                        <button className="btn btn-sm btn-success me-1" onClick={handleTitleSave}>Save</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => {
                            setTitle(selectedTask.title);
                            setIsEditingTitle(false);
                        }}>Cancel</button>
                    </div>
                )}
            </div>
            <button className="btn-close btn-close-white" onClick={closeTaskDetail}></button>
        </div>
    );
};

export default TaskDetailHeader;

import React from 'react';

const TaskDetailRight = ({ selectedTask, handleDelete }) => {
  return (
    <div className="col-md-4">

      {/* Power-Ups Section */}
      <div className="mb-4">
        <h6>Power-Ups</h6>
        <div className="bg-secondary text-white p-2 rounded mb-2">
          <strong>GitHub</strong>
        </div>
        <button className="btn btn-sm btn-outline-light w-100 mb-1">Attach Branch</button>
        <button className="btn btn-sm btn-outline-light w-100 mb-1">Attach Commit</button>
        <button className="btn btn-sm btn-outline-light w-100 mb-1">Attach Issue</button>
        <button className="btn btn-sm btn-outline-light w-100 mb-1">Attach Pull Request...</button>
      </div>

      {/* Archive Button */}
      <button
        className="btn btn-sm btn-outline-danger w-100"
        onClick={(e) => handleDelete(e, selectedTask.id)}
      >
        🗑 Archive
      </button>
    </div>
  );
};

export default TaskDetailRight;

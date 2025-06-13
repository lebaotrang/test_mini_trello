import { useState } from 'react';

const TaskDetailDescription = ({ initialValue = '', onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialValue);

  const handleSave = () => {
    if (onSave) onSave(description);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDescription(initialValue);
    setIsEditing(false);
  };

  return (
    <div className="mb-4">
      {!isEditing ? (
        <div
          className="bg-secondary text-white p-2 rounded"
          style={{ cursor: 'pointer', minHeight: '60px' }}
          onClick={() => setIsEditing(true)}
        >
          {description || <span className="text-muted">Add a more detailed description</span>}
        </div>
      ) : (
        <>
          <textarea
            className="form-control bg-secondary text-white mb-2"
            placeholder="Add a more detailed description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="d-flex gap-2">
            <button className="btn btn-primary btn-sm" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-outline-light btn-sm" onClick={handleCancel}>
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskDetailDescription;

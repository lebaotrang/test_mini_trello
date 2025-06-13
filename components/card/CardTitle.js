import { useState, useRef, useEffect } from 'react';

const CardTitle = ({
  card,
  openMenuIndex,
  toggleMenu,
  handleDeleteCard,
  handleEditCard,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(card.name);
  const inputRef = useRef(null);
  const menuRef = useRef();

  // Tự focus khi chuyển sang edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Đóng menu khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (openMenuIndex === card.id) toggleMenu(null);
      }
      // Nếu đang edit và click ngoài input => lưu và đóng edit
      if (
        isEditing &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        handleSaveTitle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuIndex, card.id, toggleMenu, isEditing]);

  const handleSaveTitle = () => {
    if (name.trim() && name !== card.name) {
      handleEditCard(card, name.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    }
    if (e.key === 'Escape') {
      setName(card.name);
      setIsEditing(false);
    }
  };

  return (
    <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
      <div
        onClick={() => !isEditing && setIsEditing(true)}
        style={{ flexGrow: 1, cursor: 'pointer' }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            className="form-control form-control-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <strong>{card.name}</strong>
        )}
      </div>

      <div className="cursor-pointer position-relative ms-2">
        <span onClick={() => toggleMenu(card.id)}>...</span>

        {openMenuIndex === card.id && (
          <div
            className="position-absolute bg-white cardTopRightMenu"
            ref={menuRef}
            style={{ right: 0, zIndex: 10 }}
          >
            <div
              className="cursor-pointer text-danger px-2 py-1"
              onClick={() => handleDeleteCard(card.id)}
            >
              Delete
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardTitle;

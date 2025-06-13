import React, { useState, useEffect, useRef } from 'react'

export default function BoardForm({ loading = false, handleCreate, title, setName, setDescription, name, description, formRef}) {

  return (
    <div ref={formRef}
        className="position-absolute top-100 end-0 mt-2 p-3 border bg-white rounded shadow"
        style={{ zIndex: 1050, width: 350 }}>
        <h6 className="mb-2">{title || 'Create New Board'}</h6>
        <input
            type="text"
            className="form-control mb-3"
            placeholder="Board name"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
            autoFocus
        />

        <input
            type="text"
            className="form-control mb-3"
            placeholder="Board description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={loading}
        />

        <button className="btn btn-success w-100" onClick={handleCreate} disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
        </button>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import Loading from '@/components/common/Loading'

export default function AddCardForm({openAddCardForm, handleAddCard, setOpenAddCardForm, setName, setDescription, name, description }) {
    return (
         openAddCardForm ? 
                            <>
                                <input
                                    className="form-control mb-2"
                                    placeholder="Card name..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <input
                                    className="form-control mb-2"
                                    placeholder="Card desciption..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <div className="d-flex justify-content-between w-100">
                                    <button className="btn btn-outline-primary btn-sm" onClick={() => handleAddCard()} disabled={!openAddCardForm}>
                                        Add card
                                    </button>
                                    <button className="btn btn-outline-secondary btn-sm" onClick={() => setOpenAddCardForm(!openAddCardForm)}>
                                        Close
                                    </button>
                                </div>
                            </>
                            :
                            <button className="btn btn-outline-primary btn-sm" onClick={() => setOpenAddCardForm(!openAddCardForm)}>
                                Add another list
                            </button>

    )
}

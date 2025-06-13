import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import Loading from './common/Loading'
import Avatar from './common/Avatar'

export default function BoardSidebar({board}) {
  return (
    <div className="col-lg-2 col-md-3 col-12 text-white min-vh-100 p-3">
        <div className="nav flex-column">

            <div className="nav-item mb-2">
                <a href="#" className="nav-link d-flex align-items-center active text-white bg-secondary rounded px-3 py-2">
                    <i className="fa fa-bar-chart me-2"></i>
                    {board.name}
                </a>
            </div>

            <div className="nav-item">
                <a href="#" className="nav-link d-flex align-items-center text-white px-3 py-2">
                    <i className="fa fa-users me-2"></i>
                    All Members
                </a>
            </div>
            
            <div className="ms-4 mt-2">
                {board?.members?.map((email, idx) => {
                    const name = email.split('@')[0]                
                    return (
                        <div key={idx} className="d-flex align-items-center text-white mb-2" >
                            <Avatar email={email} />
                            <span className="ms-2">{name}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import Loading from './common/Loading'
import { sendBoardInvite } from '@/services/boardService'

export default function InviteModal({ boardId, setShowInviteModal, setLoading, loading }) {

  const copyLink = () => {
    toast.success('coming soon!')
  }

  const sendInvite = async () => {
    const email = document.getElementById('inviteEmail').value
    if (!email) {
      toast.warning('Please enter an email')
      return
    }

    setLoading(true)

    try {
      const res = await sendBoardInvite(boardId, {
        memberEmail: email,
        status: 'pending',
        domain: window.location.origin,
      })

      if (res?.status === 200) {
        toast.success('Invitation sent!')
        document.getElementById('inviteEmail').value = ''
        setShowInviteModal(false)
      }
    } catch (error) {
      console.log(error)
      const message = error.response?.data?.error || 'Failed to send invite'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="modal fade show d-block bg-dark bg-opacity-50" tabIndex="-1" aria-labelledby="inviteModalLabel" aria-modal="true" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title" id="inviteModalLabel">Invite to Board</h5>
            <button type="button" className="btn-close btn-close-white" onClick={()=>setShowInviteModal(false)} />
          </div>
          <div className="modal-body">
            {loading && <Loading />}
            <input
              type="email"
              id="inviteEmail"
              className="form-control bg-secondary text-white mb-3"
              placeholder="Email address"
            />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <small>Invite someone to this Workspace with a link:</small>
              <button className="btn btn-outline-light btn-sm" onClick={copyLink}>
                Copy link
              </button>
            </div>
            <button className="btn btn-primary w-100" onClick={sendInvite}>
              Send Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

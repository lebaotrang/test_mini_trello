import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Cookies from 'js-cookie';
import withAuth from '@/utils/withAuth'

function InvitationAcceptPage() {
  const router = useRouter()
  const { invite_id } = router.query

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const token = Cookies.get('token')

  async function respond(status) {
    if (!invite_id) {
      setError('Missing invitation ID')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/invitations/accept', 
        { invite_id, status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // console.log(res)
      setMessage(`Invitation ${status}`)
      if(status==='accepted')
      router.push('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to respond')
    } finally {
      setLoading(false)
    }
  }

  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (message) return <p>{message}</p>

  return (
    <div className='text-white'>
      <h2>Invitation ID: {invite_id}</h2>
      <p>Do you want to accept this invitation?</p>
      <button className="btn btn-success" disabled={loading} onClick={() => respond('accepted')}>Accept</button>
      <button className="btn btn-secondary" disabled={loading} onClick={() => respond('declined')}>Decline</button>
    </div>
  )
}

export default withAuth(InvitationAcceptPage)

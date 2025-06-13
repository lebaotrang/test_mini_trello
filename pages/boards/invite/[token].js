import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { doc, getDoc, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toast } from 'react-toastify'
import jwt from 'jsonwebtoken'

async function getCurrentUser() {
  const token = Cookies.get('token')
  if (!token) return null

  try {
    let decoded
    try {
        decoded = jwt.verify(token, 'test_mini_trello')
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized or invalid token' })
    }

    const email = decoded.email
  } catch {
    return null
  }
}

export default function InvitePage() {
  const router = useRouter()
  const { token } = router.query
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const processInvite = async () => {
      const user = await getCurrentUser()

      if (!user) {
        Cookies.set('inviteToken', token, { expires: 1 })
        // router.push(`/auth/index?callbackUrl=/boards/invite/${token}`)
        return
      }

      try {
        const inviteRef = doc(db, 'invites', token)
        const inviteSnap = await getDoc(inviteRef)

        if (!inviteSnap.exists()) {
          toast.error('Invalid or expired invitation')
          Cookies.remove('inviteToken')
          router.push('/')
          return
        }

        const inviteData = inviteSnap.data()
        const boardId = inviteData.boardId

        const boardRef = doc(db, 'boards', boardId)
        await updateDoc(boardRef, {
          members: arrayUnion(user.uid),
        })

        const userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, {
          boards: arrayUnion(boardId),
        })

        await deleteDoc(inviteRef)

        toast.success('You have joined the board!')
        Cookies.remove('inviteToken')

        router.push(`/boards/${boardId}`)
      } catch (err) {
        console.error(err)
        toast.error('Failed to join board')
        Cookies.remove('inviteToken')
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    processInvite()
  }, [token, router])

  if (loading) return <p className="text-center mt-10">Joining board...</p>

  return null
}

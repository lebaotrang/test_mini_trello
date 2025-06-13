'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import NoNavbarLayout from '@/components/NoNavbarLayout'
import Loading from '@/components/common/Loading'
import { toast } from 'react-toastify';
import Link from 'next/link'
import axios from 'axios'
import Cookies from 'js-cookie';

VerificationPage.getLayout = function(page) {
  return <NoNavbarLayout>{page}</NoNavbarLayout>;
};

export default function VerificationPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
  }, [])

  const sendVerificationCode = async (e) => {
    e.preventDefault()
    if (!email) return toast.warning('Please enter your email first')
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/signup', { email })
      if (res.status === 200) {
        localStorage.setItem('login_email', email)
        toast.success('Verification code sent to your email')
        router.push('/auth/verification')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.error || 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm p-4 mb-5 position-relative" style={{ width: 400 }}>
        {loading && <Loading />}

        <div className="text-center mb-4">
          <div className="text-danger fw-bold fs-1">
            <img src="/logo.png" alt="logo" className="img-fluid" />
          </div>
          <div className="text-muted">Log in to continue</div>
        </div>
        
        <form onSubmit={sendVerificationCode}>
          <div className="mb-3">
            <input type="email" className="form-control" placeholder="Enter your email"  value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-2">Continue</button>
        </form>

        <div className="text-center mt-3 small text-muted">
          Privacy Policy<br /> This site is protected by reCAPTCHA and the Google<br />
          <a href="#" target="_blank" rel="noreferrer">
            Privacy Policy and Terms of Service apply
          </a>
          {/* <p className='mt-3 mb-0'>
            Don't have an account?{' '}
            <Link href="/auth/signup">Register here</Link>
          </p> */}
        </div>
        
      </div>
    </div>
  )
}

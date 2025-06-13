'use client'
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { auth } from '@/lib/firebase'
import NoNavbarLayout from '@/components/NoNavbarLayout'
import Loading from '@/components/common/Loading'
import { toast } from 'react-toastify';
import Link from 'next/link'
import axios from 'axios'
import Cookies from 'js-cookie';

LoginPage.getLayout = function(page) {
  return <NoNavbarLayout>{page}</NoNavbarLayout>;
};

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedEmail = localStorage.getItem('login_email')
    if (savedEmail) setEmail(savedEmail)
  }, [])

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!verificationCode) return toast.warning('Please enter the verification code')
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/signin', {
        email,
        verificationCode
      })
      if (res.status === 201) {
        // console.log(res.data)
        Cookies.set('token', res.data.accessToken, { expires: 7 });
        toast.success('Account created successfully!')
        router.push('/')
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm p-4 mb-5 position-relative" style={{ width: 400 }}>
        {loading && <Loading />}

        <div className="text-center mb-3">
          <div className="fw-bold fs-3">
            <div className="">Email Verification</div>
          </div>
          
        </div>
        
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <small className="text-muted">Please enter your code that send to your email address</small>
            <input type="password" className="form-control" placeholder="Enter code verification"  value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-2">Submit</button>
        </form>

        <div className="text-center mt-3 small text-muted">
          Privacy Policy<br /> This site is protected by reCAPTCHA and the Google<br />
          <a href="#" target="_blank" rel="noreferrer">
            Privacy Policy and Terms of Service apply
          </a>
        </div>
        
      </div>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode';
import Avatar from '@/components/common/Avatar';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef()
  const token = Cookies.get('token')
  const [email, setEmail] = useState()

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // console.log(decoded.email);
        setEmail(decoded.email);
      } catch (err) {
        console.error(err);
      }
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [token]);

  const handleLogout = async () => {
    Cookies.remove('token')
    setMenuOpen(false)
    window.location.href = '/auth/'
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4 position-relative">
      <a className="navbar-brand" href="/"><img src="/logo.png" alt="logo" className="img-fluid" style={{width: '35px'}} /></a>

      <div className="ms-auto d-flex align-items-center position-relative">
        <i className="fas fa-bell px-2 fa-lg"/>

        <div ref={menuRef} className="dropdown">

          <div className="cursor-pointer" onClick={() => { setMenuOpen(!menuOpen) }} >
            <Avatar email={email}  />
          </div>

          {menuOpen && (
            <ul className="dropdown-menu dropdown-menu-end show"
                style={{ position: 'absolute', top: '110%', right: 0, minWidth: 150 }}>
              <li>
                <a className="dropdown-item" href="/auth/profile/" onClick={() => setMenuOpen(false)}>
                  Profile
                </a>
              </li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>

      </div>
    </nav>
  )
}

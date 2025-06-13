import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function withGuest(WrappedComponent) {
  return function GuestOnlyComponent(props) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      const token = Cookies.get('token');
      if (token) {
        router.replace('/auth/profile'); // đã login → chuyển hướng
      } else {
        setChecking(false); // chưa login → cho phép vào
      }
    }, []);

    if (checking) return null; // hoặc <Loading />

    return <WrappedComponent {...props} />;
  };
}

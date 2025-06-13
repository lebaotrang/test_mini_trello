import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function withAuth(WrappedComponent) {
  return function ProtectedComponent(props) {
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
      const token = Cookies.get('token');
      if (!token) {
        router.replace('/auth');
      } else {
        setCheckingAuth(false);
      }
    }, []);

    if (checkingAuth) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

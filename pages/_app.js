import 'bootstrap/dist/css/bootstrap.min.css';
import "@/styles/globals.css";
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-toastify/dist/ReactToastify.css';
import { appWithTranslation } from 'next-i18next';
import Layout from '@/components/Layout';

const ToastContainer = dynamic(
  () => import('react-toastify').then(mod => mod.ToastContainer),
  { ssr: false }
);

function App({ Component, pageProps, router }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, [])

   const getLayout = Component.getLayout || ((page) => <Layout meta={pageProps.meta} currentPath={router.asPath}>{page}</Layout>);
  
  return (
    <>
      {getLayout(<Component {...pageProps} />)}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default appWithTranslation(App);
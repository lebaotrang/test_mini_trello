import Navbar from './Navbar';
import styles from '../styles/Custom.module.css'

export default function Layout({ children }) {
  return (
      <div className={`d-flex flex-column min-vh-100 ${styles.darkTheme}`}>
        <Navbar />
        <main className="flex-grow-1">
          {children}
        </main>
      </div>
    
  );
}

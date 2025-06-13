import styles from '../styles/AuthPage.module.css'

export default function NoNavbarLayout({ children }) {
  return (
    <div className={`d-flex flex-column min-vh-100 ${styles.authPage}`}>
      <div className="container flex-grow-1">
        <div className='row'>

          <div className="col-md-3 d-none d-md-block">
            <img src="/auth2.png" alt="Left img" className={`${styles.bgBottomLeft} img-fluid position-absolute`}/>
          </div>

          <div className="col-md-6">
            {children}
          </div>

          <div className="col-md-3 d-none d-md-block">
            <img src="/auth1.png" alt="Right img" className={`${styles.bgBottomRight} img-fluid position-absolute`}/> 
          </div>

        </div>
      </div>
    </div>
  );
}

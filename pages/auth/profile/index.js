import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {logout} from '@/services/authService'
import withAuth from '@/utils/withAuth'
import dynamic from 'next/dynamic'
import { withPageMeta } from '@/utils/withPageMeta'
import { useTranslation } from 'next-i18next'

export const getStaticProps = withPageMeta(['common'], {
  title: 'Hồ sơ của bạn',
  description: 'Nội dung',
})(async () => ({
  props: {},
}))

const ProfileForm = dynamic(() => import('./profileForm'));
const LanguageSelector = dynamic(() => import('./languageForm'));
const ChangePasswordForm = dynamic(() => import('./passwordForm'));

function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('update');
  const {t} = useTranslation('common');

  const handleLogout = async () => {
    logout();
    router.push('/auth/');
  };

  return (
    <>
    <div className="container mt-4">
      <h2>{t('profile_page')}</h2>
      <div className="row">
        <div className="col-md-3">
          <ul className="list-group">
            <li className={`list-group-item ${activeTab === 'update' && 'active'}`} onClick={() => setActiveTab('update')}>{t('update_info')}</li>
            <li className={`list-group-item ${activeTab === 'language' && 'active'}`} onClick={() => setActiveTab('language')}>{t('language')}</li>
            <li className={`list-group-item ${activeTab === 'password' && 'active'}`} onClick={() => setActiveTab('password')}>{t('change_password')}</li>
            <li className="list-group-item text-danger" onClick={handleLogout}>{t('logout')}</li>
          </ul>
        </div>
        <div className="col-md-9">
          {activeTab === 'update' && <ProfileForm t={t}/>}
          {activeTab === 'language' && <LanguageSelector t={t}/>}
          {activeTab === 'password' && <ChangePasswordForm t={t}/>}
        </div>
      </div>
    </div>
    </>
  );
}
export default withAuth(Profile);
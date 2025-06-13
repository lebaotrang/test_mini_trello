import React, { useState, useEffect } from 'react';
import { profile, updateLanguage} from '@/services/authService';
import Cookies from 'js-cookie';
import Loading from '@/components/common/Loading';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function LanguageForm({t}) {
    const [language, setLanguage] = useState('vi');
    const router = useRouter();

    const handleSubmit = async () => {
        console.log('Ngôn ngữ đã chọn:', language);
        try {
            setLoading(true);
            const response = await updateLanguage({language});
            toast.success(response.message);
            const path = router.asPath;
            router.push(path, path, { locale: language });
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }

    };

    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await profile();
            setLanguage(response.data.language);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loading />}
            <h4>{t('select_language')}</h4>
            <select className="form-select mb-3" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
            </select>
            <button className="btn btn-primary" onClick={handleSubmit}>OK</button>
        </>
    );
}

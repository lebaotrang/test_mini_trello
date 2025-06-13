import React, { useState, useEffect } from 'react';
import { profile, updateProfile} from '@/services/authService';
import Loading from '@/components/common/Loading';
import { toast } from 'react-toastify';

export default function ProfileForm() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        avatar: null,
        avatar_url: null,
    });

    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        loadProfile();
    }, []);
  
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await profile();
        const user = response.data;
        setFormData({
            name: user.name || '',
            phone: user.phone || '',
            address: user.address || '',
            // avatar: null,
            avatar_url: user.avatar_url || null,
        });
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await updateProfile(formData);
            console.log(response)
            toast.success(response.message);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        {loading && <Loading />}
        
        <form onSubmit={handleSubmit}>
            <div className="row">
                {/* Ảnh đại diện */}
                <div className="col-md-4 text-center">
                <div className="mb-3">
                    <img
                    src={formData?.avatar_url || '/default-avatar.png'}
                    alt="Avatar"
                    className="img-thumbnail mb-2"
                    style={{ width: '100%', maxHeight: 250, objectFit: 'cover' }}
                    />
                    <input
                    type="file"
                    name="avatar"
                    className="form-control"
                    onChange={handleChange}
                    />
                </div>
                </div>

                {/* Form bên phải */}
                <div className="col-md-8">
                <div className="mb-3">
                    <label>Tên</label>
                    <input
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label>Điện thoại</label>
                    <input
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label>Địa chỉ</label>
                    <input
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Lưu
                </button>
                </div>
            </div>
        </form>
        </>
    );
}

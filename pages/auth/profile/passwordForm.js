import React, { useState } from 'react';
import { updatePassword} from '@/services/authService';
import Loading from '@/components/common/Loading';
import { toast } from 'react-toastify';

export default function PasswordForm() {
  const [formData, setFormData] = useState({
    password: '',
    new_password: '',
    confirm_password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      alert('Mật khẩu mới không khớp');
      return;
    }
    console.log('Đổi mật khẩu:', formData);
    // Call API here
    try {
        setLoading(true);
        const response = await updatePassword(formData);
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
            <div className="mb-3">
                <label>Mật khẩu hiện tại</label>
                <input type="password" name="password" className="form-control" onChange={handleChange} required/>
            </div>
            <div className="mb-3">
                <label>Mật khẩu mới</label>
                <input type="password" name="new_password" className="form-control" onChange={handleChange} required/>
            </div>
            <div className="mb-3">
                <label>Xác nhận mật khẩu</label>
                <input type="password" name="confirm_password" className="form-control" onChange={handleChange} required/>
            </div>
            <button type="submit" className="btn btn-primary">Cập nhật</button>
        </form>
    </>
  );
}

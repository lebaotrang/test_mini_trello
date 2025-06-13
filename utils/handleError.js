import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Router from 'next/router';

export const handleError = (error) => {
  try {
    if (error.response) {
      const { status, data } = error.response;

      let messageFromServer = '';

      if (data) {
        if (typeof data === 'string') {
          try {
            const parsed = JSON.parse(data);
            messageFromServer = parsed.message || '';
          } catch {
            messageFromServer = data;
          }
        } else if (typeof data === 'object' && data.error) {
          messageFromServer = data.error;
        }
      }

      const defaultMessages = {
        400: 'Yêu cầu không hợp lệ (400)',
        401: 'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn (401)',
        403: 'Bạn không có quyền truy cập (403)',
        404: 'Không tìm thấy (404)',
        500: 'Lỗi máy chủ (500)',
      };

      const message = messageFromServer || defaultMessages[status] || `Lỗi không xác định (${status})`;

      toast.error(message);
      
      if(status==401) {
        Cookies.remove('token')
        Router.push("/")
      }
    } else if (error.request) {
      toast.error('Không nhận được phản hồi từ máy chủ');
    } else {
      toast.error('Lỗi không xác định xảy ra');
    }
  } catch (err) {
    toast.error('Đã xảy ra lỗi khi xử lý phản hồi lỗi');
  }
};

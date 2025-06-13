import axios from 'axios';
import { handleError } from '@/utils/handleError';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// const getAuthHeaders = () => ({
//   headers: {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` }),
//   },
// });

export const getAuthHeaders = () => {
  const token = Cookies.get('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};


export const profile = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/my-profile`, getAuthHeaders());
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const login = async (body) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, body, getAuthHeaders());
    const { token } = response.data.data;
    // Lưu token vào localStorage
    if (token) {
      Cookies.set('token', token, { expires: 7 });
    }
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const logout = async () => {
  try {
    Cookies.remove('token');
    return true;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const updateProfile = async (body) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/update-profile`, body, getAuthHeaders());
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const updateLanguage = async (body) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/change-language`, body, getAuthHeaders());
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const updatePassword = async (body) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/change-password`, body, getAuthHeaders());
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
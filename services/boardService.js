import axios from 'axios';
import { handleError } from '@/utils/handleError';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getAuthHeaders = () => {
    const token = Cookies.get('token');
    
    if (!token) {
        toast.error('No token found')
        return
    }
    
    return {
        headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        },
    };
}; 

export const listBoards = async () => {
  try {
    const response = await axios.get(`/api/boards`, getAuthHeaders());
    return response;
  } catch (error) {
    handleError(error);
    // throw error; // không dừng ctrinh
  }
};

export const detailBoard = async (id) => {
  try {
    const response = await axios.get(`/api/boards/${id}`, getAuthHeaders());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const createBoard = async (name, description) => {
    try {
        let body = JSON.stringify({ name: name.trim(), description: description.trim() })
        const response = await axios.post(`/api/boards`,body, getAuthHeaders());
        return response;
    } catch (error) {
        handleError(error);
    }
}

export const updateBoard = async (id, name, description) => {
  try {
    let body = JSON.stringify({ name: name.trim(), description: description.trim() })
    const response = await axios.put(`/api/boards/${id}`, body, getAuthHeaders());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const deleteBoard = async (id) => {
  try {
    const response = await axios.delete(`/api/boards/${id}`, getAuthHeaders());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const sendBoardInvite = async (boardId, data) => {
  try {
    const response = await axios.post(`/api/boards/${boardId}/invite`, data, getAuthHeaders());
    return response;
  } catch (error) {
    handleError(error);
  }
};

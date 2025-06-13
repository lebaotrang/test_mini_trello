import axios from 'axios';
import { handleError } from '@/utils/handleError';
import Cookies from 'js-cookie';

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

export const detailTask = async (boardId, cardId, taskId) => {
  try {
    const response = await axios.get(`/api/boards/${boardId}/cards/${cardId}/tasks/${taskId}`, getAuthHeaders());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const createTask = async (boardId, cardId, title, description) => {
    try {
        let body = JSON.stringify({ title, description })
        const response = await axios.post(`/api/boards/${boardId}/cards/${cardId}/tasks`, body, getAuthHeaders());
        return response;
    } catch (error) {
        handleError(error);
    }
}

export const deleteTask = async (boardId, cardId, taskId) => {
  try {
    const response = await axios.delete(`/api/boards/${boardId}/cards/${cardId}/tasks/${taskId}`, getAuthHeaders());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const updateTaskOrder = async (boardId, cardId, taskIds = []) => {
  try {
    const response = await axios.patch(`/api/boards/${boardId}/cards/${cardId}/tasks`, { tasks: taskIds }, getAuthHeaders());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const updateTask = async (boardId, cardId, taskId, updateFields = {}) => {
  try {
    const response = await axios.put(`/api/boards/${boardId}/cards/${cardId}/tasks/${taskId}`, updateFields, getAuthHeaders());
    return response;
  } catch (error) {
    handleError(error);
  }
};

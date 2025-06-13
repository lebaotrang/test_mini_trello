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

export const listCards = async (boardId) => {
  try {
    const response = await axios.get(`/api/boards/${boardId}/cards`, getAuthHeaders());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const detailCard = async (id) => {
  try {
    const response = await axios.get(`/api/cards?id=${id}`, getAuthHeaders());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const createCard = async (boardId, name, description) => {
    try {
        let body = JSON.stringify({ boardId, name: name.trim(), description: description.trim() })
        const response = await axios.post(`/api/boards/${boardId}/cards`, body, getAuthHeaders());
        return response;
    } catch (error) {
        handleError(error);
    }
}

export const deleteCard = async (boardId, cardId) => {
  try {
    const response = await axios.delete(`/api/boards/${boardId}/cards/${cardId}`, getAuthHeaders());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const updateCardOrder = async (boardId, cardIds = []) => {
  try {
    const response = await axios.patch(`/api/boards/${boardId}/cards`, { cards: cardIds }, getAuthHeaders());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const updateCard = async (boardId, cardId, updateFields) => {
  try {
    const response = await axios.put(`/api/boards/${boardId}/cards/${cardId}`, updateFields, getAuthHeaders());
    return response;
  } catch (error) {
    handleError(error);
  }
};
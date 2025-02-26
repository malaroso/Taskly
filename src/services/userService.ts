import axiosInstance from '../config/axios';
import { UserDetail } from '../types/userTypes';

export const getUserDetail = async (): Promise<UserDetail> => {
    try {
        const response = await axiosInstance.get('/getuserdetail');
        return response.data;
    } catch (error) {
        console.error('Error fetching user detail:', error);
        throw error;
    }
}; 
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

interface User {
    id: number;
    name: string;
    email: string;
    profile_image: string;
}

interface UsersResponse {
    status: boolean;
    data: User[];
}

export const getAllUsers = async (): Promise<UsersResponse> => {
    const response = await axiosInstance.get<UsersResponse>('/getAllUsers');
    return response.data;
};

export const updatePassword = async (current_password: string, new_password: string) => {
    try {
        const response = await axiosInstance.post('/updateUserPassword', {
            current_password,
            new_password
        });
        return response.data;
    } catch (error) {
        console.error('Update password error:', error);
        throw error;
    }
}; 
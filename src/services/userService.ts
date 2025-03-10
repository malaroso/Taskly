import axiosInstance from '../config/axios';
import { UserDetail, UpdateUserData, UpdateUserResponse, UsersResponse } from '../types/userTypes';
import * as ImagePicker from 'expo-image-picker';

export const getUserDetail = async (): Promise<UserDetail> => {
    try {
        const response = await axiosInstance.get('/getuserdetail');
        return response.data;
    } catch (error) {
        console.error('Error fetching user detail:', error);
        throw error;
    }
};

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

export const updateUser = async (userData: UpdateUserData): Promise<UpdateUserResponse> => {
    try {
        const response = await axiosInstance.post<UpdateUserResponse>('/updateUser', userData);
        return response.data;
    } catch (error) {
        console.error('Update user error:', error);
        throw error;
    }
};

export const uploadImage = async () => {
    try {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (!permissionResult.granted) {
            throw new Error('Permission to access camera roll is required!');
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!pickerResult.canceled) {
            // Burada resmi bir CDN'e yükleyip URL'ini döndürebilirsiniz
            // Şimdilik sadece local URI'yi döndürüyoruz
            return pickerResult.assets[0].uri;
        }
        
        return null;
    } catch (error) {
        console.error('Error picking image:', error);
        throw error;
    }
}; 
import axiosInstance from '../config/axios';
import { NotificationResponse } from '../types/notificationTypes';

export const getNotifications = async (): Promise<NotificationResponse> => {
    const response = await axiosInstance.get<NotificationResponse>('/notifications');
    return response.data;
};

export const markNotificationAsRead = async (notification_id: number) => {
    const response = await axiosInstance.post('/notifications/mark-read', {
        notification_id
    });
    return response.data;
};

export const deleteNotification = async (notification_id: number) => {
    const response = await axiosInstance.delete('/notifications', {
        data: { notification_id }
    });
    return response.data;
};

export const getUnreadCount = async () => {
    const response = await axiosInstance.get('/notifications/unread-count');
    return response.data;
}; 
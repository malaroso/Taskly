import { GetUserTasksResponse, TaskDetailResponse , TaskAttachmentsResponse, TaskCommentsResponse} from '../types/taskTypes';
import axiosInstance from '../config/axios';

export const getUserTasks = async (): Promise<GetUserTasksResponse> => {
  const response = await axiosInstance.get<GetUserTasksResponse>('/getUserTasks');
  return response.data;
};

export const getTaskDetail = async (taskID: number): Promise<TaskDetailResponse> => {
  const response = await axiosInstance.post<TaskDetailResponse>('/getTaskDetail', { taskID });
  return response.data;
};

export const getTaskAttachments = async (taskID: number): Promise<TaskAttachmentsResponse> => {
    try {
        const response = await axiosInstance.post('/getTasksAttachments', { taskID });
        return response.data;
    } catch (error) {
        console.error('Error fetching task attachments:', error);
        throw error;
    }
};

export const getTaskComments = async (taskID: number): Promise<TaskCommentsResponse> => {
    try {
        const response = await axiosInstance.post('/getTaskComents', { taskID });
        return response.data;
    } catch (error) {
        console.error('Error fetching task comments:', error);
        throw error;
    }
}; 
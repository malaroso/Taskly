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

export const addTask = async (formData: any) => {
    try {
        const response = await axiosInstance.post('/addTask', formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

export const deleteTask = async (taskID: number) => {
    try {
        const response = await axiosInstance.post('/deleteTask', { taskID });
        return response.data;
    } catch (error) {
        console.error('Delete task error:', error);
        throw error;
    }
};

export const addComment = async (task_id: number, comment: string) => {
    try {
        const response = await axiosInstance.post('/addComments', {
            task_id,
            comment
        });
        return response.data;
    } catch (error) {
        console.error('Add comment error:', error);
        throw error;
    }
};

export const deleteComment = async (comment_id: number) => {
    try {
        const response = await axiosInstance.post('/deleteComments', { comment_id });
        return response.data;
    } catch (error) {
        console.error('Delete comment error:', error);
        throw error;
    }
};

export const updateComment = async (comment_id: number, comment: string) => {
    try {
        const response = await axiosInstance.post('/updateComments', {
            comment_id,
            comment
        });
        return response.data;
    } catch (error) {
        console.error('Update comment error:', error);
        throw error;
    }
};

interface TaskAttachmentData {
    description: string;
    file_path: string;
}

export const addTaskAttachment = async (taskId: number, attachments: TaskAttachmentData[]) => {
    try {
        const response = await axiosInstance.post('/addTaskAttachment', {
            task_id: taskId,
            attachments
        });
        return response.data;
    } catch (error) {
        console.error('Add task attachment error:', error);
        throw error;
    }
}; 
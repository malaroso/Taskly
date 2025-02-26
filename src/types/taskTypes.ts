export interface Task {
  task_id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  other_user_images: string[]; // string yerine string array
}

export interface TaskDetail {
  task_id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  assigned_users: string; // JSON string olarak geliyor
}

export interface GetUserTasksResponse {
  status: boolean;
  data: Task[];
}

export interface TaskDetailResponse {
  status: boolean;
  data: TaskDetail;
} 

export interface TaskAttachment {
  file_path: string;
  created_at: string;
  description: string;
  uploaded_by_name: string;
}

export interface TaskAttachmentsResponse {
  status: boolean;
  data: TaskAttachment[];
}

export interface TaskComment {
    comment: string;
    created_at: string;
    user_id: number;
    user_name: string;
    user_profile_image: string;
}

export interface TaskCommentsResponse {
    status: boolean;
    data: TaskComment[];
}
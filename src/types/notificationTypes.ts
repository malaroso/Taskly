export interface Notification {
    notification_id: number;
    user_id: number;
    title: string;
    message: string;
    type: string;
    is_read: number;
    created_at: string;
    read_at: string | null;
    priority: string;
    link: string;
    item_id: number;
    item_type: string;
    is_deleted: number;
}

export interface NotificationResponse {
    status: boolean;
    data?: Notification[];
    message?: string;
} 
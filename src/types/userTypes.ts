export interface UserDetailData {
    user_id: number;
    username: string;
    email: string;
    role_description: string;
    permissions: string;
}

export interface UserDetail {
    status: boolean;
    data: UserDetailData[];
}

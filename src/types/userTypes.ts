export interface UserDetailData {
    user_id: number;
    username: string;
    email: string;
    role_description: string;
    permissions: string;
    profile_image: string | null;
    phone_number: string;
    address: string;
    city: string;
    country: string;
}

export interface UserDetail {
    status: boolean;
    data: UserDetailData[];
}


export interface User {
    id: number;
    name: string;
    email: string;
    profile_image: string;
}

export interface UsersResponse {
    status: boolean;
    data: User[];
}



export interface UpdateUserData {
    name: string;
    email: string;
    profile_image?: string;
    phone_number: string;
    birth_date?: string;
    gender?: string;
    address: string;
    city: string;
    country: string;
    zip_code?: string;
}

export interface UpdateUserResponse {
    status: boolean;
    message: string;
}

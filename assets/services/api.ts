import { ApiResponse, LoginCredentials, RegisterCredentials, NoteFormData, NotesFilter } from '../types';

const API_BASE = '/api';

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
        credentials: 'include',
    });

    const data = await response.json();
    return data;
}

// Auth API
export const authApi = {
    login: (credentials: LoginCredentials) =>
        request('/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),

    register: (credentials: RegisterCredentials) =>
        request('/register', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),

    logout: () =>
        request('/logout', {
            method: 'POST',
        }),

    getCurrentUser: () =>
        request('/user'),

    confirmEmail: (token: string) =>
        request(`/confirm/${token}`),
};

// Notes API
export const notesApi = {
    list: (filters: NotesFilter = {}) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.category) params.append('category', filters.category);
        
        const queryString = params.toString();
        return request(`/notes${queryString ? `?${queryString}` : ''}`);
    },

    get: (id: number) =>
        request(`/notes/${id}`),

    create: (data: NoteFormData) =>
        request('/notes', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: number, data: Partial<NoteFormData>) =>
        request(`/notes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: number) =>
        request(`/notes/${id}`, {
            method: 'DELETE',
        }),
};

// Categories API
export const categoriesApi = {
    list: () => request('/categories'),
};

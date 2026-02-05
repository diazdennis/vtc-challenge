export interface User {
    id: number;
    email: string;
}

export interface Note {
    id: number;
    title: string;
    content: string;
    category: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    value: string;
    label: string;
}

export interface Status {
    value: string;
    label: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    user?: User;
    note?: Note;
    notes?: Note[];
    categories?: Category[];
    statuses?: Status[];
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
}

export interface NoteFormData {
    title: string;
    content: string;
    category: string;
    status?: string;
}

export interface NotesFilter {
    search?: string;
    status?: string;
    category?: string;
}

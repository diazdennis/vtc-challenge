import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Note, Category, Status } from '../../types';
import { notesApi, categoriesApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
    PageWrapper,
    Container,
    Header,
    Logo,
    Nav,
    UserInfo,
    Button,
    Grid,
    Alert,
    CenteredText,
} from '../../components/shared/styled';
import NoteCard from './components/NoteCard';
import SearchBar from './components/SearchBar';

const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const PageTitle = styled.h2`
    font-size: 24px;
    color: #333;
    margin: 0;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 40px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NotesListPage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const fetchCategories = useCallback(async () => {
        try {
            const response = await categoriesApi.list();
            if (response.success) {
                setCategories(response.categories || []);
                setStatuses(response.statuses || []);
            }
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    }, []);

    const fetchNotes = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await notesApi.list({
                search: search || undefined,
                status: statusFilter || undefined,
                category: categoryFilter || undefined,
            });
            
            if (response.success) {
                setNotes(response.notes || []);
            } else {
                setError(response.message || 'Failed to load notes');
            }
        } catch (err) {
            setError('An error occurred while loading notes');
        } finally {
            setIsLoading(false);
        }
    }, [search, statusFilter, categoryFilter]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchNotes();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [fetchNotes]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleEdit = (note: Note) => {
        navigate(`/notes/${note.id}/edit`);
    };

    const handleDelete = async (note: Note) => {
        if (!window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
            return;
        }

        try {
            const response = await notesApi.delete(note.id);
            if (response.success) {
                setNotes(notes.filter((n) => n.id !== note.id));
            } else {
                setError(response.message || 'Failed to delete note');
            }
        } catch (err) {
            setError('An error occurred while deleting the note');
        }
    };

    const handleCreateNote = () => {
        navigate('/notes/new');
    };

    return (
        <PageWrapper>
            <Header>
                <Logo>Notes App</Logo>
                <Nav>
                    <UserInfo>{user?.email}</UserInfo>
                    <Button variant="secondary" onClick={handleLogout}>
                        Logout
                    </Button>
                </Nav>
            </Header>
            
            <Container>
                <PageHeader>
                    <PageTitle>My Notes</PageTitle>
                    <Button onClick={handleCreateNote}>Create Note</Button>
                </PageHeader>

                <SearchBar
                    search={search}
                    status={statusFilter}
                    category={categoryFilter}
                    categories={categories}
                    statuses={statuses}
                    onSearchChange={setSearch}
                    onStatusChange={setStatusFilter}
                    onCategoryChange={setCategoryFilter}
                />

                {error && <Alert type="error" style={{ marginTop: '20px' }}>{error}</Alert>}

                {isLoading ? (
                    <CenteredText>Loading notes...</CenteredText>
                ) : notes.length === 0 ? (
                    <EmptyState>
                        <h3>No notes found</h3>
                        <p>
                            {search || statusFilter || categoryFilter
                                ? 'Try adjusting your search filters'
                                : 'Create your first note to get started!'}
                        </p>
                        {!search && !statusFilter && !categoryFilter && (
                            <Button onClick={handleCreateNote}>Create Note</Button>
                        )}
                    </EmptyState>
                ) : (
                    <Grid>
                        {notes.map((note) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </Grid>
                )}
            </Container>
        </PageWrapper>
    );
};

export default NotesListPage;

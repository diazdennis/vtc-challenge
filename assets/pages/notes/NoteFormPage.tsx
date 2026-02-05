import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Category, Status, Note } from '../../types';
import { notesApi, categoriesApi } from '../../services/api';
import {
    PageWrapper,
    Container,
    Card,
    Title,
    Form,
    FormGroup,
    Label,
    Input,
    TextArea,
    Select,
    Button,
    Alert,
    FlexRow,
} from '../../components/shared/styled';

const FormWrapper = styled(Card)`
    max-width: 800px;
    margin: 40px auto;
`;

const ButtonGroup = styled(FlexRow)`
    justify-content: flex-end;
    margin-top: 24px;
`;

const NoteFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditing = id !== 'new' && id !== undefined;
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('new');
    const [categories, setCategories] = useState<Category[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(isEditing);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catResponse = await categoriesApi.list();
                if (catResponse.success) {
                    setCategories(catResponse.categories || []);
                    setStatuses(catResponse.statuses || []);
                    
                    // Set default category if creating new note
                    if (!isEditing && catResponse.categories && catResponse.categories.length > 0) {
                        setCategory(catResponse.categories[0].value);
                    }
                }

                if (isEditing && id) {
                    const noteResponse = await notesApi.get(parseInt(id));
                    if (noteResponse.success && noteResponse.note) {
                        const note = noteResponse.note;
                        setTitle(note.title);
                        setContent(note.content);
                        setCategory(note.category);
                        setStatus(note.status);
                    } else {
                        setError('Note not found');
                    }
                }
            } catch (err) {
                setError('Failed to load data');
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [id, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const noteData = { title, content, category, status };
            
            let response;
            if (isEditing && id) {
                response = await notesApi.update(parseInt(id), noteData);
            } else {
                response = await notesApi.create(noteData);
            }

            if (response.success) {
                navigate('/notes');
            } else {
                setError(response.message || 'Failed to save note');
            }
        } catch (err) {
            setError('An error occurred while saving the note');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/notes');
    };

    if (isFetching) {
        return (
            <PageWrapper>
                <Container>
                    <FormWrapper>
                        <Title>Loading...</Title>
                    </FormWrapper>
                </Container>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Container>
                <FormWrapper>
                    <Title>{isEditing ? 'Edit Note' : 'Create Note'}</Title>
                    
                    {error && <Alert type="error">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter note title"
                                required
                            />
                        </FormGroup>
                        
                        <FormGroup>
                            <Label htmlFor="content">Content</Label>
                            <TextArea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter note content"
                                required
                            />
                        </FormGroup>
                        
                        <FlexRow>
                            <FormGroup style={{ flex: 1 }}>
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                >
                                    {categories.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                                </Select>
                            </FormGroup>
                            
                            <FormGroup style={{ flex: 1 }}>
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    required
                                >
                                    {statuses.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </Select>
                            </FormGroup>
                        </FlexRow>
                        
                        <ButtonGroup>
                            <Button type="button" variant="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : (isEditing ? 'Update Note' : 'Create Note')}
                            </Button>
                        </ButtonGroup>
                    </Form>
                </FormWrapper>
            </Container>
        </PageWrapper>
    );
};

export default NoteFormPage;

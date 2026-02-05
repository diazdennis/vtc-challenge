import React from 'react';
import styled from 'styled-components';
import { Note } from '../../../types';
import { Card, Badge, Button, FlexRow } from '../../../components/shared/styled';

const NoteCardWrapper = styled(Card)`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const NoteTitle = styled.h3`
    font-size: 18px;
    color: #333;
    margin: 0;
`;

const NoteContent = styled.p`
    color: #666;
    font-size: 14px;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const MetaRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
`;

const BadgeGroup = styled.div`
    display: flex;
    gap: 8px;
`;

const Actions = styled.div`
    display: flex;
    gap: 8px;
`;

const SmallButton = styled(Button)`
    padding: 6px 12px;
    font-size: 12px;
`;

const DateText = styled.span`
    font-size: 12px;
    color: #999;
`;

interface NoteCardProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (note: Note) => void;
}

const getCategoryColor = (category: string): string => {
    switch (category) {
        case 'personal':
            return '#28a745';
        case 'work':
            return '#007bff';
        case 'ideas':
            return '#ffc107';
        case 'archive':
            return '#6c757d';
        default:
            return '#e9ecef';
    }
};

const getStatusColor = (status: string): string => {
    switch (status) {
        case 'new':
            return '#17a2b8';
        case 'todo':
            return '#fd7e14';
        case 'done':
            return '#28a745';
        default:
            return '#e9ecef';
    }
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
    return (
        <NoteCardWrapper>
            <NoteTitle>{note.title}</NoteTitle>
            <NoteContent>{note.content}</NoteContent>
            <BadgeGroup>
                <Badge color={getCategoryColor(note.category)}>
                    {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
                </Badge>
                <Badge color={getStatusColor(note.status)}>
                    {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
                </Badge>
            </BadgeGroup>
            <MetaRow>
                <DateText>Updated: {formatDate(note.updatedAt)}</DateText>
                <Actions>
                    <SmallButton variant="secondary" onClick={() => onEdit(note)}>
                        Edit
                    </SmallButton>
                    <SmallButton variant="danger" onClick={() => onDelete(note)}>
                        Delete
                    </SmallButton>
                </Actions>
            </MetaRow>
        </NoteCardWrapper>
    );
};

export default NoteCard;

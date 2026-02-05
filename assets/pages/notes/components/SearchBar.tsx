import React from 'react';
import styled from 'styled-components';
import { Category, Status } from '../../../types';
import { FlexRow, SearchInput, FilterSelect } from '../../../components/shared/styled';

const SearchWrapper = styled.div`
    background: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

interface SearchBarProps {
    search: string;
    status: string;
    category: string;
    categories: Category[];
    statuses: Status[];
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    search,
    status,
    category,
    categories,
    statuses,
    onSearchChange,
    onStatusChange,
    onCategoryChange,
}) => {
    return (
        <SearchWrapper>
            <FlexRow>
                <SearchInput
                    type="text"
                    placeholder="Search notes by title or content..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <FilterSelect
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    {statuses.map((s) => (
                        <option key={s.value} value={s.value}>
                            {s.label}
                        </option>
                    ))}
                </FilterSelect>
                <FilterSelect
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                        <option key={c.value} value={c.value}>
                            {c.label}
                        </option>
                    ))}
                </FilterSelect>
            </FlexRow>
        </SearchWrapper>
    );
};

export default SearchBar;

import styled from 'styled-components';

export const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
`;

export const PageWrapper = styled.div`
    min-height: 100vh;
    background-color: #f5f5f5;
`;

export const Card = styled.div`
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 24px;
`;

export const FormCard = styled(Card)`
    max-width: 400px;
    margin: 40px auto;
`;

export const Title = styled.h1`
    font-size: 24px;
    color: #333;
    margin-bottom: 24px;
    text-align: center;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const Label = styled.label`
    font-size: 14px;
    font-weight: 500;
    color: #333;
`;

export const Input = styled.input`
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.2s;

    &:focus {
        outline: none;
        border-color: #007bff;
    }
`;

export const TextArea = styled.textarea`
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    min-height: 150px;
    resize: vertical;
    font-family: inherit;
    transition: border-color 0.2s;

    &:focus {
        outline: none;
        border-color: #007bff;
    }
`;

export const Select = styled.select`
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    background: white;
    cursor: pointer;
    transition: border-color 0.2s;

    &:focus {
        outline: none;
        border-color: #007bff;
    }
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    ${({ variant = 'primary' }) => {
        switch (variant) {
            case 'secondary':
                return `
                    background-color: #6c757d;
                    color: white;
                    &:hover { background-color: #5a6268; }
                `;
            case 'danger':
                return `
                    background-color: #dc3545;
                    color: white;
                    &:hover { background-color: #c82333; }
                `;
            default:
                return `
                    background-color: #007bff;
                    color: white;
                    &:hover { background-color: #0056b3; }
                `;
        }
    }}

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const LinkButton = styled.button`
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    font-size: 14px;
    text-decoration: underline;

    &:hover {
        color: #0056b3;
    }
`;

export const Alert = styled.div<{ type?: 'success' | 'error' | 'info' }>`
    padding: 12px 16px;
    border-radius: 4px;
    margin-bottom: 16px;

    ${({ type = 'info' }) => {
        switch (type) {
            case 'success':
                return `
                    background-color: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                `;
            case 'error':
                return `
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                `;
            default:
                return `
                    background-color: #cce5ff;
                    color: #004085;
                    border: 1px solid #b8daff;
                `;
        }
    }}
`;

export const Header = styled.header`
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const Logo = styled.h1`
    font-size: 20px;
    color: #333;
    margin: 0;
`;

export const Nav = styled.nav`
    display: flex;
    gap: 16px;
    align-items: center;
`;

export const UserInfo = styled.span`
    color: #666;
    font-size: 14px;
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
`;

export const FlexRow = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
`;

export const SearchInput = styled(Input)`
    flex: 1;
    min-width: 200px;
`;

export const FilterSelect = styled(Select)`
    min-width: 150px;
`;

export const Badge = styled.span<{ color?: string }>`
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    background-color: ${({ color }) => color || '#e9ecef'};
    color: ${({ color }) => (color ? 'white' : '#333')};
`;

export const TextLink = styled.a`
    color: #007bff;
    text-decoration: none;
    
    &:hover {
        text-decoration: underline;
    }
`;

export const CenteredText = styled.p`
    text-align: center;
    color: #666;
    margin-top: 16px;
`;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    PageWrapper,
    FormCard,
    Title,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Alert,
    CenteredText,
} from '../../components/shared/styled';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/notes');
        } else {
            setError(result.message || 'Login failed');
        }

        setIsLoading(false);
    };

    return (
        <PageWrapper>
            <FormCard>
                <Title>Login</Title>
                
                {error && <Alert type="error">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </FormGroup>
                    
                    <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </FormGroup>
                    
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </Form>
                
                <CenteredText>
                    Don't have an account? <Link to="/register">Register</Link>
                </CenteredText>
            </FormCard>
        </PageWrapper>
    );
};

export default LoginPage;

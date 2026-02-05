import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);

        const result = await register(email, password);

        if (result.success) {
            setSuccess(result.message || 'Registration successful! Please check your email to confirm your account.');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } else {
            setError(result.message || 'Registration failed');
        }

        setIsLoading(false);
    };

    return (
        <PageWrapper>
            <FormCard>
                <Title>Register</Title>
                
                {error && <Alert type="error">{error}</Alert>}
                {success && <Alert type="success">{success}</Alert>}
                
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
                            placeholder="Enter your password (min 6 characters)"
                            required
                            minLength={6}
                        />
                    </FormGroup>
                    
                    <FormGroup>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            required
                        />
                    </FormGroup>
                    
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </Button>
                </Form>
                
                <CenteredText>
                    Already have an account? <Link to="/login">Login</Link>
                </CenteredText>
            </FormCard>
        </PageWrapper>
    );
};

export default RegisterPage;

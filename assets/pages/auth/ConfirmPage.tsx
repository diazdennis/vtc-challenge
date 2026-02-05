import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authApi } from '../../services/api';
import {
    PageWrapper,
    FormCard,
    Title,
    Alert,
    Button,
    CenteredText,
} from '../../components/shared/styled';

const ConfirmPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const confirmEmail = async () => {
            if (!token) {
                setError('Invalid confirmation link');
                setIsLoading(false);
                return;
            }

            try {
                const response = await authApi.confirmEmail(token);
                
                if (response.success) {
                    setSuccess(response.message || 'Your account has been confirmed!');
                } else {
                    setError(response.message || 'Failed to confirm account');
                }
            } catch (err) {
                setError('An error occurred while confirming your account');
            } finally {
                setIsLoading(false);
            }
        };

        confirmEmail();
    }, [token]);

    return (
        <PageWrapper>
            <FormCard>
                <Title>Email Confirmation</Title>
                
                {isLoading && (
                    <CenteredText>Confirming your account...</CenteredText>
                )}
                
                {!isLoading && error && (
                    <>
                        <Alert type="error">{error}</Alert>
                        <CenteredText>
                            <Link to="/register">Back to Register</Link>
                        </CenteredText>
                    </>
                )}
                
                {!isLoading && success && (
                    <>
                        <Alert type="success">{success}</Alert>
                        <Link to="/login">
                            <Button style={{ width: '100%' }}>Go to Login</Button>
                        </Link>
                    </>
                )}
            </FormCard>
        </PageWrapper>
    );
};

export default ConfirmPage;

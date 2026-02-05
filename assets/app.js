/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/app.scss';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ConfirmPage from './pages/auth/ConfirmPage';
import NotesListPage from './pages/notes/NotesListPage';
import NoteFormPage from './pages/notes/NoteFormPage';

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/confirm/:token" element={<ConfirmPage />} />
                    
                    {/* Protected routes */}
                    <Route
                        path="/notes"
                        element={
                            <ProtectedRoute>
                                <NotesListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/notes/new"
                        element={
                            <ProtectedRoute>
                                <NoteFormPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/notes/:id/edit"
                        element={
                            <ProtectedRoute>
                                <NoteFormPage />
                            </ProtectedRoute>
                        }
                    />
                    
                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/notes" replace />} />
                    <Route path="*" element={<Navigate to="/notes" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

const rootNode = createRoot(document.getElementById('app'));
rootNode.render(<App />);

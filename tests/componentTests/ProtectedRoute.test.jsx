import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { getCurrentUser } from 'aws-amplify/auth';

vi.mock('aws-amplify/auth', () => ({
    getCurrentUser: vi.fn(),
}));

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders child component when user is authenticated', async () => {
        getCurrentUser.mockReturnValue({ username: 'testuser' });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    test('redirects to login page when user is not authenticated', async () => {
        getCurrentUser.mockRejectedValue(new Error('User not authenticated'));

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
});

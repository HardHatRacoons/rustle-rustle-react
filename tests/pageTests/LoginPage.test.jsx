import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import LoginButton from '../../src/pages/LoginPage';
import { useUser } from '../../src/components/UserContext';
import { signInWithRedirect, signOut } from 'aws-amplify/auth';

vi.mock('aws-amplify/auth', () => ({
    signInWithRedirect: vi.fn(),
    signOut: vi.fn(),
}));

vi.mock('../../src/components/UserContext', () => ({
    useUser: vi.fn(),
}));

describe('LoginButton', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders sign in button', () => {
        useUser.mockReturnValue(null);
        render(<LoginButton />);
        expect(screen.getByText(/Sign In with Google/)).toBeInTheDocument();
    });

    test('calls signInWithRedirect on button click when user is not signed in', async () => {
        useUser.mockReturnValue(null);
        render(<LoginButton />);
        fireEvent.click(screen.getByLabelText('sign-in-button'));
        expect(signInWithRedirect).toHaveBeenCalledWith({ provider: 'Google' });
    });

    test('calls signOut and then signInWithRedirect on button click when user is signed in', async () => {
        useUser.mockReturnValue({ username: 'testuser' });
        render(<LoginButton />);
        fireEvent.click(screen.getByLabelText('sign-in-button'));
        expect(signOut).toHaveBeenCalled();
    });
});

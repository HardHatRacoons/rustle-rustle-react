import { render, screen, fireEvent, act } from '@testing-library/react';

import * as Auth from 'aws-amplify/auth';

import LogOutButton from '../../src/components/GoogleSignOut';

describe('Testing google signout component', () => {
    beforeAll(() => {
        vi.mock(import('aws-amplify/auth'), async (importOriginal) => {
            const actual = await importOriginal();
            return {
                ...actual,
                signOut: vi
                    .fn()
                    .mockRejectedValueOnce(new Error('error with sign out'))
                    .mockResolvedValue('success!'),
            };
        });
    });

    test('No info provided', () => {
        render(<LogOutButton />);
    });

    test('click logout unhappy', async () => {
        const consoleSpy = vi.spyOn(console, 'error');

        render(<LogOutButton />);

        fireEvent.click(screen.getByLabelText('sign-out-button'));
        await act(() => {});

        expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    test('click logout happy', async () => {
        const consoleSpy = vi.spyOn(console, 'log');
        render(<LogOutButton />);

        fireEvent.click(screen.getByLabelText('sign-out-button'));
        await act(() => {});

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringMatching('success'),
        );
    });
});

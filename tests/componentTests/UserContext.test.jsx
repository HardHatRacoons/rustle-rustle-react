import { render, screen, act, waitFor } from '@testing-library/react';

import * as Auth from 'aws-amplify/auth';

import { UserProvider, useUser } from '../../src/components/UserContext';

describe('Testing user context component', () => {
    beforeAll(() => {
        vi.mock(import('aws-amplify/auth'), async (importOriginal) => {
            const actual = await importOriginal();
            return {
                ...actual,
                fetchUserAttributes: vi.fn()
                .mockRejectedValueOnce(new Error("an error!"))
                .mockResolvedValue({
                    email: 'user@example.com',
                    phone_number: '+1234567890',
                    given_name: 'John',
                    sub: 'some-uuid',
                }),
            };
        });
    });

    test('user context unhappy path', async () => {
        const consoleSpy = vi.spyOn(console, 'error');

        render(
                        <UserProvider>
                            <div>Hello Hello</div>
                        </UserProvider>,
                    );

        await act(() => {
        });

        expect(consoleSpy).toHaveBeenCalledTimes(1);

    });

    test('user context with children', async () => {
        await act(() => {
            render(
                <UserProvider>
                    <div>Hello Hello</div>
                </UserProvider>,
            );
        });

        expect(screen.getByText(/Hello/)).toBeInTheDocument();
    });

// this might be untestable for now
//     test('user context use user', async () => {
//         await act(() => {
//             render(
//                 <UserProvider>
//                     <div>Hello Hello</div>
//                 </UserProvider>,
//             );
//         });
//
//         //const user = useUser();
//
//         //console.log(user);
//     });
});

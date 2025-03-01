import {
    render,
    screen,
    fireEvent,
    act,
    waitFor,
} from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

import * as PDFJS from 'pdfjs-dist';
import * as Storage from 'aws-amplify/storage';
import * as Auth from 'aws-amplify/auth';

import App from '../src/App';
import { UserProvider } from '../src/components/UserContext';

describe('Testing authentication blocking', () => {
    test('auth blocks access to all pages', async () => {});
});

describe('Testing main setup and routing after auth', () => {
    // render app to test
    beforeAll(() => {
        //     render(
        //       <MemoryRouter>
        //         <App />
        //       </MemoryRouter>
        //     );

        vi.mock(import('aws-amplify/storage'), async (importOriginal) => {
            const actual = await importOriginal();
            return {
                ...actual,
                getUrl: vi.fn().mockResolvedValue({
                    url: new URL('https://fake-pdf-endpoint/pdf.pdf'),
                }),
            };
        });

        vi.mock(import('pdfjs-dist'), async (importOriginal) => {
            const actual = await importOriginal();
            return {
                ...actual,
                getDocument: vi.fn().mockResolvedValue({
                    numPages: 1,
                    getPage: vi.fn().mockResolvedValue({
                        getTextContent: vi
                            .fn()
                            .mockResolvedValue({ items: [] }),
                    }),
                }),
            };
        });

        global.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };

        //mock auth too
        vi.mock(import('aws-amplify/auth'), async (importOriginal) => {
            const actual = await importOriginal();
            return {
                ...actual,
                signInWithRedirect: vi
                    .fn()
                    .mockImplementation(({ provider }) => {
                        console.log(provider);
                    }),
                getCurrentUser: vi.fn().mockResolvedValue({
                    username: 'user123',
                    userId: '1234556789',
                }),
                fetchUserAttributes: vi.fn().mockResolvedValue({
                    email: 'user@example.com',
                    phone_number: '+1234567890',
                    given_name: 'John',
                    sub: 'some-uuid',
                }),
            };
        });
    });

    test.only('home page should be rendered first', async () => {
        render(
            <MemoryRouter>
                <UserProvider>
                    <App />
                </UserProvider>
            </MemoryRouter>,
        );
        await act(() => {});

        expect(screen.getByText(/Welcome/)).toBeInTheDocument();
        expect(screen.getByText(/Gallery/)).toBeInTheDocument();
        expect(screen.getByText(/Upload/)).toBeInTheDocument();
    });

    test('can move to blueprint page', async () => {
        render(
            <MemoryRouter initialEntries={['/file/123/blueprint']}>
                <UserProvider>
                    <App />
                </UserProvider>
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(screen.getByLabelText('pdf viewer')).toBeInTheDocument();
    });

    test('can move to table page', async () => {
        render(
            <MemoryRouter initialEntries={['/file/123/table']}>
                <UserProvider>
                    <App />
                </UserProvider>
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(screen.getByLabelText('table')).toBeInTheDocument();
    });

    test('can move to metric page', async () => {
        render(
            <MemoryRouter initialEntries={['/file/123/metrics']}>
                <UserProvider>
                    <App />
                </UserProvider>
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(screen.getByLabelText('metrics')).toBeInTheDocument();
    });

    test('can move between pages with navbar', async () => {
        render(
            <MemoryRouter initialEntries={['/file/123/blueprint']}>
                <UserProvider>
                    <App />
                </UserProvider>
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(screen.getByLabelText('pdf viewer')).toBeInTheDocument();

        fireEvent.click(screen.getByText(/Table/));
        await act(async () => {
            // wait for render to finish
        });
        expect(screen.getByLabelText('table')).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Metrics/));
        await act(async () => {
            // wait for render to finish
        });
        expect(screen.getByLabelText('metrics')).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Blueprint/));
        await act(async () => {
            // wait for render to finish
        });
        expect(screen.getByLabelText('pdf viewer')).toBeInTheDocument();
    });

    test('back button returns to home', async () => {
        render(
            <MemoryRouter initialEntries={['/file/123/blueprint']}>
                <UserProvider>
                    <App />
                </UserProvider>
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        fireEvent.click(screen.getByLabelText('back'));
        expect(screen.getByText(/Welcome/)).toBeInTheDocument();
        expect(screen.getByText(/Gallery/)).toBeInTheDocument();
        expect(screen.getByText(/Upload/)).toBeInTheDocument();
    });

    test('trying to hit file route goes to blueprint as default', async () => {
        render(
            <MemoryRouter initialEntries={['/file/123']}>
                <UserProvider>
                    <App />
                </UserProvider>
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(screen.getByLabelText('pdf viewer')).toBeInTheDocument();
    });

    test('error when accessing nonexistent route', async () => {
        render(
            <MemoryRouter initialEntries={['/randomroute']}>
                <UserProvider>
                    <App />
                </UserProvider>
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(screen.getByText(/Error/)).toBeInTheDocument();

        //go back home

        fireEvent.click(screen.getByLabelText('back'));
        await act(async () => {});

        expect(screen.getByText(/Welcome/)).toBeInTheDocument();
        expect(screen.getByText(/Gallery/)).toBeInTheDocument();
        expect(screen.getByText(/Upload/)).toBeInTheDocument();
    });

    test('error when loading nonexistent file', async () => {
        render(
            <MemoryRouter initialEntries={['/file/12']}>
                <UserProvider>
                    <App />
                </UserProvider>
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(screen.getByText(/Error/)).toBeInTheDocument();
    });
});

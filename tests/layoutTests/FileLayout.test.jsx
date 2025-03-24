import { MemoryRouter, Routes, Route } from 'react-router';
import { render, screen, act, fireEvent } from '@testing-library/react';
import FileLayout from '../../src/layouts/FileLayout'; // Adjust the import path as needed
import { useUser } from '../../src/components/UserContext';
import { vi } from 'vitest';
import { getUrl, getProperties } from 'aws-amplify/storage';

vi.mock('../../src/components/UserContext', () => {
    const useUser = vi.fn();
    return { useUser };
});

vi.mock('aws-amplify/storage', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        getUrl: vi.fn(),
        getProperties: vi.fn(),
    };
});

describe('FileLayout Component', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('shows loading when looking for data', async () => {
        useUser.mockReturnValueOnce(null);
        render(
            <MemoryRouter initialEntries={['/child']}>
                <Routes>
                    <Route path="/" element={<FileLayout />}>
                        <Route
                            path="child"
                            element={<p data-test-id="child-element">child</p>}
                        />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        expect(document.body).toHaveTextContent('Loading...');
    });

    it('displays error if unannotated does not exist', async () => {
        useUser.mockReturnValueOnce({ sub: 'testuser' });
        getUrl.mockRejectedValueOnce(new Error('file not found'));
        getUrl.mockRejectedValueOnce(new Error('file not found'));
        getUrl.mockRejectedValueOnce(new Error('file not found'));
        getUrl.mockRejectedValueOnce(new Error('file not found'));
        render(
            <MemoryRouter initialEntries={['/child']}>
                <Routes>
                    <Route path="/" element={<FileLayout />}>
                        <Route
                            path="child"
                            element={<p data-test-id="child-element">child</p>}
                        />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );
        
        await act(async () => {});
        expect(document.body).toHaveTextContent(/Error./);
    });

    it('displays error if annotated does not exist', async () => {
        useUser.mockReturnValueOnce({ sub: 'testuser' });
        getUrl.mockReturnValueOnce({ url: { toString: () => 'testurl' } });
        getUrl.mockRejectedValueOnce(new Error('file not found'));

        render(
            <MemoryRouter initialEntries={['/child']}>
                <Routes>
                    <Route path="/" element={<FileLayout />}>
                        <Route
                            path="child"
                            element={<p data-test-id="child-element">child</p>}
                        />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        await act(async () => {});
        expect(document.body).toHaveTextContent('Error');
    });

    it('displays pdf still even if annotated csv data does not exist', async () => {
        useUser.mockReturnValueOnce({ sub: 'testuser' });
        getUrl.mockReturnValueOnce({ url: { toString: () => 'testurl' } });
        getUrl.mockReturnValueOnce({ url: { toString: () => 'testurl' } });
        getUrl.mockRejectedValueOnce(new Error('file not found'));

        render(
            <MemoryRouter initialEntries={['/child']}>
                <Routes>
                    <Route path="/" element={<FileLayout />}>
                        <Route
                            path="child"
                            element={<p data-test-id="child-element">child</p>}
                        />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        await act(async () => {});
        expect(document.body).toHaveTextContent('Document');
    });

    it('displays Document as a file name if the file metadata is empty', async () => {
        useUser.mockReturnValueOnce({ sub: 'testuser' });
        getUrl.mockReturnValueOnce({ url: { toString: () => 'testurl' } });
        getUrl.mockReturnValueOnce({ url: { toString: () => 'testurl' } });
        getUrl.mockReturnValueOnce({ url: { toString: () => 'testurl' } });
        getProperties.mockResolvedValueOnce({ metadata: {} });

        render(
            <MemoryRouter initialEntries={['/child']}>
                <Routes>
                    <Route path="/" element={<FileLayout />}>
                        <Route
                            path="child"
                            element={<p data-test-id="child-element">child</p>}
                        />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        await act(async () => {});
        expect(document.body).toHaveTextContent('Document');
    });

    it('displays Document as a file name if the file does not exist yet', async () => {
        useUser.mockReturnValueOnce({ sub: 'testuser' });
        getUrl.mockReturnValueOnce({ url: { toString: () => 'testurl' } });
        getUrl.mockReturnValueOnce({ url: { toString: () => 'testurl' } });
        getUrl.mockReturnValueOnce({ url: { toString: () => 'testurl' } });
        getProperties.mockRejectedValueOnce(new Error('file not found'));

        render(
            <MemoryRouter initialEntries={['/child']}>
                <Routes>
                    <Route path="/" element={<FileLayout />}>
                        <Route
                            path="child"
                            element={<p data-test-id="child-element">child</p>}
                        />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        await act(async () => {});
        expect(document.body).toHaveTextContent('Document');
    });

    it('can return home from an invalid file', async () => {
        useUser.mockReturnValueOnce({ sub: 'testuser' });
        getUrl.mockRejectedValueOnce(new Error('file not found'));
        getUrl.mockRejectedValueOnce(new Error('file not found'));
        getUrl.mockRejectedValueOnce(new Error('file not found'));

        render(
            <MemoryRouter initialEntries={['/file/child']}>
                <Routes>
                    <Route path="/" element={<p>Home page</p>}>
                    </Route>
                    <Route path="/file" element={<FileLayout />}>
                        <Route
                            path="child"
                            element={<p data-test-id="child-element">child</p>}
                        />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        await act(async () => {});
        expect(screen.getByLabelText('back')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('back'));
        await act(async () => {});
        global.dump(document.body, 'test');
        expect(screen.getByText(/Home/)).toBeInTheDocument();
    });
});

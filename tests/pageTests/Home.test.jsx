import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import Home from '../../src/pages/Home';
import { beforeAll } from 'vitest';
import FileList from '../../src/pages/Home';
import { useUser } from '../../src/components/UserContext';
import { list, getProperties } from 'aws-amplify/storage';
import { MemoryRouter } from 'react-router';

describe('Testing home page', () => {
    beforeAll(() => {
        vi.mock(import('react-router'), async (importOriginal) => {
            const actual = await importOriginal();
            return {
                ...actual,
                useNavigate: vi.fn().mockResolvedValue({
                    navigate: vi.fn(),
                }),
            };
        });
    });

    test('Normal Load Home page', () => {
        render(<Home />);
    });

    test('Upload Modal open/close testing', () => {
        render(<Home />);

        fireEvent.click(screen.getByLabelText('open-upload-button'));
        expect(screen.getByText(/Upload File/)).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('close-upload-button'));
        expect(screen.queryByText(/Upload File/)).not.toBeInTheDocument();
    });

    test('Upload Modal open/close file input', () => {
        render(<Home />);

        //TBD
    });
});


vi.mock('../../src/components/UserContext', () => ({
    useUser: vi.fn(),
}));

vi.mock('aws-amplify/storage', () => ({
    list: vi.fn(),
    getProperties: vi.fn(),
}));

describe('FileList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders loading message while fetching files', () => {
        useUser.mockReturnValue({ sub: 'testuser' });
        list.mockResolvedValue({ items: [] });

        render(
            <MemoryRouter>
                <FileList folder="annotated" setSelectedFile={vi.fn()} setIsDeleteModalOpen={vi.fn()} />
            </MemoryRouter>
        );

        expect(screen.getByText('Loading files...')).toBeInTheDocument();
    });

    test('renders message when no files are found', async () => {
        useUser.mockReturnValue({ sub: 'testuser' });
        list.mockResolvedValue({ items: [] });

        render(
            <MemoryRouter>
                <FileList folder="annotated" setSelectedFile={vi.fn()} setIsDeleteModalOpen={vi.fn()} />
            </MemoryRouter>
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(screen.getByText(/No files found./)).toBeInTheDocument();
    });

    test('renders list of files when files are available', async () => {
        useUser.mockReturnValue({ sub: 'testuser' });
        list.mockResolvedValue({
            items: [
                { path: 'annotated/testuser/file1.pdf' },
                { path: 'annotated/testuser/file2.pdf' },
            ],
        });
        getProperties.mockResolvedValueOnce({
            metadata: { name: 'File 1' },
        });
        getProperties.mockResolvedValueOnce({
            metadata: { name: 'File 2' },
        });

        render(
            <MemoryRouter>
                <FileList folder="annotated" setSelectedFile={vi.fn()} setIsDeleteModalOpen={vi.fn()} />
            </MemoryRouter>
        );

        await act(async () => {
            // wait for render to finish
        });
        expect(screen.getByText('File 1')).toBeInTheDocument();
        expect(screen.getByText('File 2')).toBeInTheDocument();
    });

    test('renders file as document when name is unavailable', async () => {
        useUser.mockReturnValue({ sub: 'testuser' });
        list.mockResolvedValue({
            items: [
                { path: 'annotated/testuser/file1.pdf' },
            ],
        });
        getProperties.mockResolvedValue({
            metadata: {},
        });

        render(
            <MemoryRouter>
                <FileList folder="annotated" setSelectedFile={vi.fn()} setIsDeleteModalOpen={vi.fn()} />
            </MemoryRouter>
        );

        await act(async () => {
            // wait for render to finish
        });
        expect(screen.getByText('Document')).toBeInTheDocument();
    });

    test('renders error message when fetching files fails', async () => {
        useUser.mockReturnValue({ sub: 'testuser' });
        list.mockResolvedValue({
            items: [
                { path: 'annotated/testuser/file1.pdf' },
            ],
        });
        getProperties.mockRejectedValue(new Error('Failed getting property'));
        render(
            <MemoryRouter>
                <FileList folder="annotated" setSelectedFile={vi.fn()} setIsDeleteModalOpen={vi.fn()} />
            </MemoryRouter>
        );

        await act(async () => {
            // wait for render to finish
        });
        expect(screen.getByText('Document')).toBeInTheDocument();
    });
});

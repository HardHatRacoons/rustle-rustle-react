import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { list, getProperties, getUrl } from 'aws-amplify/storage';
import FileList from '../../src/components/FileList';
import { useNavigate } from 'react-router';

vi.mock('react-router', () => ({
    useNavigate: vi.fn(),
}));

vi.mock(import('aws-amplify/storage'), () => ({
    list: vi.fn(),
    getProperties: vi.fn(),
    getUrl: vi.fn(),
}));

describe('FileList Component', () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    const mockUserAttributes = { sub: '12345' };
    const mockSetSelectedFile = vi.fn();
    const mockSetIsDeleteModalOpen = vi.fn();

    const renderComponent = (props = {}) => {
        return render(
            <FileList
                userAttributes={mockUserAttributes}
                folder="testFolder"
                searchQuery=""
                setSelectedFile={mockSetSelectedFile}
                setIsDeleteModalOpen={mockSetIsDeleteModalOpen}
                {...props}
            />,
        );
    };

    // afterEach(() => {
    //     vi.restoreAllMocks();
    // });

    it('renders loading state initially', () => {
        renderComponent();
        expect(screen.getByText('Loading files...')).toBeInTheDocument();
    });

    it('renders no files found message when no files match the search query', async () => {
        list.mockResolvedValueOnce({ items: [] });
        renderComponent({ searchQuery: 'nonexistent' });
        expect(await screen.findByText('No files found.')).toBeInTheDocument();
    });

    it('renders a file with a png image', async () => {
        const mockFile1 = {
            path: 'testFolder/12345/testfile.png',
        };
        const mockFile2 = {
            path: 'testFolder/12345/testfile.pdf',
        };
        const mockUrl = 'https://example.com/testfile.png';

        list.mockResolvedValueOnce({ items: [mockFile1, mockFile2] });
        getUrl.mockResolvedValueOnce({ url: mockUrl });

        renderComponent();

        expect(await screen.findByAltText('Document')).toBeInTheDocument();
    });

    it('handles error when getting the url of a non-existent file', async () => {
        const mockFile1 = {
            path: 'testFolder/12345/testfile.png',
        };

        list.mockResolvedValueOnce({ items: [mockFile1] });
        getUrl.mockRejectedValueOnce(new Error('File not found'));
        getUrl.mockRejectedValueOnce(new Error('File not found'));

        renderComponent();

        expect(await screen.findByText('No files found.')).toBeInTheDocument();
    });
});

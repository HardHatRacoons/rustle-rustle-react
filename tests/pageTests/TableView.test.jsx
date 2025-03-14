import { prettyDOM, render, screen } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import { getUrl } from 'aws-amplify/storage';
import TableView from '../../src/pages/TableView';
import { useOutletContext } from 'react-router';

import d3, { csvParse } from 'd3';
import { act } from 'react';

const pdfInfo = {
    url: { annotated: { csv: 'test.csv' } },
    path: { annotated: { csv: 'test.csv' } },
};

useOutletContext.mockReturnValue(pdfInfo);

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useOutletContext: vi.fn(),
    };
});

vi.mock('d3', async () => {
    const actual = await vi.importActual('d3');
    return {
        ...actual,
        csvParse: vi.fn(),
    };
});

vi.mock('aws-amplify/storage', async () => {
    const actual = await vi.importActual('aws-amplify/storage');
    return {
        ...actual,
        uploadData: vi.fn(),
        getUrl: vi.fn().mockResolvedValue({
            url: {
                toString: () => 'https://example.com',
            }
        }),
    };
});


describe('TableView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = '';
    });

    test('handles empty data gracefully', async () => {
        
        useOutletContext.mockReturnValue({
            url: { annotated: { csv: null } },
            path: { annotated: { csv: null } },
        });
        
        render(
            <MemoryRouter initialEntries={['/tableview']}>
                <Routes>
                    <Route path="/tableview" element={<TableView />} />
                </Routes>
            </MemoryRouter>,
        );
        await act(async () => {
            return new Promise((resolve) => setTimeout(resolve, 500));
        });
        expect(screen.getByText('Page Number')).toBeInTheDocument();
    });

    test('renders table with correct data', async () => {
        global.fetch = vi.fn();
        global.fetch.mockResolvedValueOnce({
            json: () => [{
                "PageNumber": 15,
                "AreaName": "BLDG 1 - Partial Roof Framing Plan - Area A",
                "Quantity": 1,
                "Shape": "W",
                "Size": "W27X84",
                "Length": 38,
                "WeightFT": 84,
                "WeightEA": 3192,
                "TopOfSteel": 1,
                "GUID": "b_1HKsX5Bt9EXeENMZEuCz_F"
            }, 
            {
                "PageNumber": 15,
                "AreaName": "BLDG 1 - Partial Roof Framing Plan - Area A",
                "Quantity": 1,
                "Shape": "W",
                "Size": "W27X84",
                "Length": 38,
                "WeightFT": 84,
                "WeightEA": 3192,
                "TopOfSteel": 1,
                "GUID": "b_1HKsX5Bt9EXeENMZEuCz_F"
            }],
            ok: true,
        });

        render(
            <MemoryRouter initialEntries={['/tableview']}>
                <Routes>
                    <Route path="/tableview" element={<TableView />} />
                </Routes>
            </MemoryRouter>,
        );

        await act(async () => {
            return new Promise((resolve) => setTimeout(resolve, 4000));
        });
        global.dump(document.body, 'TableView1');
        expect(
            screen.getAllByRole('row')[0],
        ).toBeInTheDocument();
    });
});

import { fetchJSONData } from '../../src/pages/TableView';

describe('fetchJSONData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('fetches and sets JSON data successfully', async () => {
        const jsonData = [
            {
                PageNumber: 15,
                AreaName: 'BLDG 1 - Partial Roof Framing Plan - Area A',
                Quantity: 1,
                Shape: 'W',
                Size: 'W27X84',
                Length: 38,
                WeightFT: 84,
                WeightEA: 3192,
                TopOfSteel: 1,
                GUID: 'b_1HKsX5Bt9EXeENMZEuCz_F',
            },
        ];

        getUrl.mockResolvedValueOnce({
            url: {
                toString: () => 'https://example.com/test.json',
            },
        });

        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => jsonData,
        });

        const setRowData = vi.fn();

        await fetchJSONData('https://example.com/test.csv', 'path/to/test.json', setRowData);

        expect(getUrl).toHaveBeenCalledWith({
            path: 'path/to/test.json',
            options: {
                bucket: 'raccoonTeamDrive',
                validateObjectExistence: true,
                expiresIn: 900,
            },
        });
        expect(global.fetch).toHaveBeenCalledWith('https://example.com/test.json');
        expect(setRowData).toHaveBeenCalledWith(jsonData);
    });

    test('throws an error when fetching CSV data fails', async () => {
        getUrl.mockResolvedValueOnce({
            url: {
                toString: () => 'https://example.com/test.json',
            },
        });

        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: false,
        });

        const setRowData = vi.fn();

        await expect(() => fetchJSONData('https://example.com/test.csv', 'path/to/test.json', setRowData))
            .toThrowError('Unexpected error: Failed to fetch CSV file');
        expect(getUrl).toHaveBeenCalledWith({
            path: 'path/to/test.json',
            options: {
                bucket: 'raccoonTeamDrive',
                validateObjectExistence: true,
                expiresIn: 900,
            },
        });
        expect(global.fetch).toHaveBeenCalledWith('https://example.com/test.json');
    });

    test('throws an error when getUrl fails', async () => {
        getUrl.mockResolvedValueOnce(false);

        const setRowData = vi.fn();

        await expect(fetchJSONData('https://example.com/test.csv', 'path/to/test.json', setRowData)).rejects.toThrow('Failed to fetch JSON file');
        expect(getUrl).toHaveBeenCalledWith({
            path: 'path/to/test.json',
            options: {
                bucket: 'raccoonTeamDrive',
                validateObjectExistence: true,
                expiresIn: 900,
            },
        });
    });
});

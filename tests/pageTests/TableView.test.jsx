import { prettyDOM, render, screen, act } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import { getUrl } from 'aws-amplify/storage';
import TableView from '../../src/pages/TableView';
import { useOutletContext } from 'react-router';

import d3, { csvParse } from 'd3';

describe('TableView', () => {
    beforeAll(() => {
        vi.mock('react-router', async () => {
            const actual = await vi.importActual('react-router');
            const pdfInfo = {
                url: { annotated: { csv: 'test.csv' } },
                path: { annotated: { csv: 'test.csv' } },
            };

            const emptyPdfInfo = {
                url: { annotated: { csv: null } },
                path: { annotated: { csv: null } },
            };

            return {
                ...actual,
                useOutletContext: vi
                    .fn()
                    .mockReturnValueOnce(pdfInfo)
                    .mockReturnValueOnce(pdfInfo)
                    .mockReturnValueOnce(emptyPdfInfo)
                    .mockReturnValue(pdfInfo),
            };
        });

        vi.mock('d3', async () => {
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

            const actual = await vi.importActual('d3');
            return {
                ...actual,
                csvParse: vi.fn().mockReturnValue(jsonData),
            };
        });

        vi.mock('aws-amplify/storage', async () => {
            const actual = await vi.importActual('aws-amplify/storage');
            return {
                ...actual,
                uploadData: vi.fn(),
                getUrl: vi
                    .fn()
                    .mockRejectedValueOnce(new Error('NotFound'))
                    .mockRejectedValueOnce(new Error('NotFound'))
                    .mockResolvedValueOnce({
                        url: new URL('https://example.com/test.json'),
                    })
                    .mockResolvedValueOnce(null)
                    .mockResolvedValue({
                        url: new URL('https://example.com/test.json'),
                    }),
            };
        });

        const csvData = `PageNumber,AreaName,Quantity,Shape,Size,Length,WeightFT,WeightEA,TopOfSteel,GUID
        15,BLDG 1 - Partial Roof Framing Plan - Area A,1,W,W27X84,38,84,3192,1,b_1HKsX5Bt9EXeENMZEuCz_F`;

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
                GUID: 'c_1AGsX5Bt9EXeTZGBEuCz_F',
            },
        ];

        global.fetch = vi
            .fn()
            .mockResolvedValueOnce({
                ok: false,
            })
            .mockResolvedValueOnce({
                text: () => csvData,
                ok: true,
            })
            .mockResolvedValueOnce({
                ok: false,
            })
            .mockResolvedValue({
                ok: true,
                json: async () => jsonData,
            });

        const setRowData = vi.fn();
    });

    test('failing csv data when json doesnt exist', async () => {
        const setRowData = vi.fn();
        const consoleSpy = vi.spyOn(console, 'error');

        render(
            <MemoryRouter initialEntries={['/tableview']}>
                <Routes>
                    <Route path="/tableview" element={<TableView />} />
                </Routes>
            </MemoryRouter>,
        );

        await act(async () => {});

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringMatching('Unexpected CSV error:'),
        );
        expect(getUrl).toHaveBeenCalledWith({
            path: 'test.json',
            options: {
                bucket: 'raccoonTeamDrive',
                validateObjectExistence: true,
                expiresIn: 900,
            },
        });
        expect(global.fetch).toHaveBeenCalledWith('test.csv');
    });

    test('getting csv data bc json doesnt exist', async () => {
        render(
            <MemoryRouter initialEntries={['/tableview']}>
                <Routes>
                    <Route path="/tableview" element={<TableView />} />
                </Routes>
            </MemoryRouter>,
        );

        await act(async () => {});

        expect(global.fetch).toHaveBeenCalledWith('test.csv');
        expect(
            screen.getByText('BLDG 1 - Partial Roof Framing Plan - Area A'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('b_1HKsX5Bt9EXeENMZEuCz_F'),
        ).toBeInTheDocument();
    });

    test('Error when fetching CSV data fails', async () => {
        const setRowData = vi.fn();
        const consoleSpy = vi.spyOn(console, 'error');

        render(
            <MemoryRouter initialEntries={['/tableview']}>
                <Routes>
                    <Route path="/tableview" element={<TableView />} />
                </Routes>
            </MemoryRouter>,
        );

        await act(async () => {});

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringMatching('Unexpected JSON error:'),
        );
        expect(getUrl).toHaveBeenCalledWith({
            path: 'test.json',
            options: {
                bucket: 'raccoonTeamDrive',
                validateObjectExistence: true,
                expiresIn: 900,
            },
        });
        expect(global.fetch).toHaveBeenCalledWith(
            'https://example.com/test.json',
        );
    });

    test('throws an error when getUrl fails', async () => {
        const setRowData = vi.fn();
        const consoleSpy = vi.spyOn(console, 'error');

        render(
            <MemoryRouter initialEntries={['/tableview']}>
                <Routes>
                    <Route path="/tableview" element={<TableView />} />
                </Routes>
            </MemoryRouter>,
        );
        await act(async () => {});
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringMatching('Unexpected JSON error:'),
        );

        expect(getUrl).toHaveBeenCalledWith({
            path: 'test.json',
            options: {
                bucket: 'raccoonTeamDrive',
                validateObjectExistence: true,
                expiresIn: 900,
            },
        });
    });

    test('handles empty data gracefully', async () => {
        render(
            <MemoryRouter initialEntries={['/tableview']}>
                <Routes>
                    <Route path="/tableview" element={<TableView />} />
                </Routes>
            </MemoryRouter>,
        );
        await act(async () => {});

        expect(screen.getByText('Page Number')).toBeInTheDocument();
    });

    test('fetches and sets JSON data successfully, table rendered successfully', async () => {
        //await fetchJSONData('https://example.com/test.csv', 'path/to/test.json', setRowData);

        render(
            <MemoryRouter initialEntries={['/tableview']}>
                <Routes>
                    <Route path="/tableview" element={<TableView />} />
                </Routes>
            </MemoryRouter>,
        );

        await act(async () => {});

        expect(getUrl).toHaveBeenCalledWith({
            path: 'test.json',
            options: {
                bucket: 'raccoonTeamDrive',
                validateObjectExistence: true,
                expiresIn: 900,
            },
        });
        expect(global.fetch).toHaveBeenCalledWith(
            'https://example.com/test.json',
        );
        expect(
            screen.getAllByText(
                'BLDG 1 - Partial Roof Framing Plan - Area A',
            )[0],
        ).toBeInTheDocument();
        expect(
            screen.getAllByText(
                'BLDG 1 - Partial Roof Framing Plan - Area A',
            )[1],
        ).toBeInTheDocument();
        expect(
            screen.getByText('b_1HKsX5Bt9EXeENMZEuCz_F'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('c_1AGsX5Bt9EXeTZGBEuCz_F'),
        ).toBeInTheDocument();
    });
});

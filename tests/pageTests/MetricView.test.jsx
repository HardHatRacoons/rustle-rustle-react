import { render, screen, fireEvent, act } from '@testing-library/react';

import MetricView from '../../src/pages/MetricView';

describe('Testing metric view page', () => {
    beforeAll(() => {
        vi.mock(import('aws-amplify/storage'), async (importOriginal) => {
            const actual = await importOriginal();
            return {
                ...actual,
                getUrl: vi
                    .fn()
                    //                       .mockRejectedValueOnce(new Error('Invalid file'))
                    .mockResolvedValue({
                        url: new URL('https://fake-endpoint/json.json'),
                    }),
            };
        });

        vi.mock(import('react-router'), async (importOriginal) => {
            const actual = await importOriginal();
            return {
                ...actual,
                useOutletContext: vi
                    .fn()
                    .mockReturnValueOnce({
                        url: {
                            annotated: { pdf: 'annotated.pdf' },
                        },
                        path: {
                            annotated: { pdf: 'annotated.pdf' },
                        },
                    })
                    .mockReturnValue({
                        url: {
                            annotated: {
                                pdf: 'annotated.pdf',
                                csv: 'annotated.csv',
                            },
                            unannotated: { pdf: 'unannotated.pdf' },
                        },
                        path: {
                            annotated: {
                                pdf: 'annotated.pdf',
                                csv: 'annotated.csv',
                            },
                            unannotated: { pdf: 'unannotated.pdf' },
                        },
                    }),
            };
        });

        global.fetch = vi.fn().mockImplementation(async (url) => {
            if (url.toString() === 'https://fake-endpoint/json.json') {
                return {
                    ok: true,
                    json: vi.fn().mockResolvedValue([
                        {
                            PageNumber: 7,
                            AreaName: 'Second Floor - Framing Plan Area A',
                            Quantity: 1,
                            Shape: 'W',
                            Size: 'W21X68',
                            Length: 30.84,
                            WeightFT: 68.0,
                            WeightEA: 2097.12,
                            TopOfSteel: 1,
                            GUID: 'a_27UAyzOZf13AypYEBn7iFL',
                        },
                        {
                            PageNumber: 7,
                            AreaName: 'Second Floor - Framing Plan Area A',
                            Quantity: 1,
                            Shape: 'W',
                            Size: 'W21X68',
                            Length: 30.84,
                            WeightFT: 68.0,
                            WeightEA: 2097.12,
                            TopOfSteel: 1,
                            GUID: 'b_27UAyzOZf13AypYEBn7iFL',
                        },
                        {
                            PageNumber: 8,
                            AreaName: 'First Floor - Framing Plan Area B',
                            Quantity: 1,
                            Shape: 'W',
                            Size: 'W21X68',
                            Length: 30.84,
                            WeightFT: 68.0,
                            WeightEA: 2097.12,
                            TopOfSteel: 1,
                            GUID: 'c_27UAyzOZf13AypYEBn7iFL',
                        },
                    ]),
                };
            }
        });
    });

    test('bad data', async () => {
        render(<MetricView />);
        await act(() => {});
    });

    test('Normal Load MetricView page', async () => {
        render(<MetricView />);
        await act(() => {});
    });

    test('test pin/unpin', async () => {
        render(<MetricView />);
        await act(() => {});

        const card1 = screen.getByLabelText('card-0');
        const card2 = screen.getByLabelText('card-1');
        const card3 = screen.getByLabelText('card-2');

        //fix this later; the logic is a little weird so need to investigate
        expect(card1.compareDocumentPosition(card2)).toBe(4);
        expect(card2.compareDocumentPosition(card3)).toBe(4);

        fireEvent.click(card3);
        await act(() => {});

        expect(card3.compareDocumentPosition(card1)).toBe(4);
        expect(card3.compareDocumentPosition(card2)).toBe(4);
        expect(card1.compareDocumentPosition(card2)).toBe(4);

        fireEvent.click(card3);
        await act(() => {});

        expect(card1.compareDocumentPosition(card2)).toBe(4);
        expect(card2.compareDocumentPosition(card3)).toBe(4);
    });

    test('render stuff idk', async () => {
        render(<MetricView />);
        await act(() => {});
    });
});

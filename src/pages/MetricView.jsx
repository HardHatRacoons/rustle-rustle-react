import { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { useOutletContext } from 'react-router';
import fetchJSONData from '../components/JsonFetch';
import graph from '../components/Grapher';
import { motion, AnimatePresence } from 'framer-motion';

/*
 * The metric view for a file. Contains graphs on pinnable cards to show the user data about the pdf.
 *
 * @component
 * @returns {React.ReactElement} the rendered metric view.
 */
function MetricView() {
    const { pdfInfo } = useOutletContext();
    const [csvURL, setCsvURL] = useState(pdfInfo?.url.annotated.csv); //alrdy a download url
    const [jsonPath, setJsonPath] = useState(
        pdfInfo?.path.annotated.csv
            ? pdfInfo.path.annotated.csv.split('.')[0] + '.json'
            : null,
    );

    const defaultGraphTypes = [
        'bar',
        'bar',
        'text',
        'histogram',
        'pie',
        'bar',
        'bar',
    ];
    const defaultOptions = [
        { 1: 'Shape', 2: 'Count' },
        { 1: 'Size', 2: 'Count', 3: true },
        {
            1: 'Sum',
            2: 'WeightEA',
            3: 'Average',
            4: 'WeightEA',
            5: 'Sum',
            6: 'Length',
            7: 'Average',
            8: 'Length',
        },
        { 1: 'Length' },
        { 1: 'Size' },
        { 1: 'Size', 2: 'Sum', 3: true, 4: 'Length' },
        { 1: 'Shape', 2: 'Sum', 3: true, 4: 'WeightEA' },
    ];
    const [defaultMetricLength, setDefaultMetricLength] = useState(7); //default 7 overview graphs

    const [pinned, setPinned] = useState(null);
    const [data, setData] = useState([]);

    /*
     * Calls the grapher function with the right graphing options to generate graphs
     *
     * @function
     */
    const generateGraphs = () => {
        const theme = localStorage.getItem('theme') || 'light';
        for (let idx = 0; idx < defaultMetricLength; idx++) {
            const container = document.getElementById(`graph-container-${idx}`);
            graph(container, data, defaultGraphTypes[idx], {
                ...defaultOptions[idx],
                theme: theme,
            });
        }
    };

    /*
     * Calls the grapher function with the right graphing options to generate graphs
     *
     * @function
     * @param {number} key The key of the clicked card
     */
    const onPin = (key) => {
        let set = { ...pinned };
        if (!set[key]) {
            set[key] = true;
        } else {
            delete set[key];
        }

        setPinned(set);
        localStorage.setItem('pinned', JSON.stringify(set));
    };

    /*
     * Generates the order of the graph cards.
     *
     * @function
     * @returns {Array} the display order of the graph cards.
     */
    const grid = () => {
        let ordered = [];
        let map = {};

        if (pinned) {
            Object.keys(pinned).forEach((key) => {
                ordered.push({ idx: key });
                map[key] = true;
            });
        }
        for (let idx = 0; idx < defaultMetricLength; idx++) {
            if (!map[idx]) ordered.push({ idx: idx });
        }

        return ordered;
    };

    useEffect(() => {
        fetchJSONData(csvURL, jsonPath, setData);
    }, [jsonPath]);

    useEffect(() => {
        generateGraphs();
    }, [data]);

    useEffect(() => {
        const json = pdfInfo?.path.annotated.csv
            ? pdfInfo.path.annotated.csv.split('.')[0] + '.json'
            : null;
        setJsonPath(json);
        setCsvURL(pdfInfo?.url.annotated.csv);
    }, [pdfInfo]);

    useEffect(() => {
        const pins = localStorage.getItem('pinned');
        setPinned(JSON.parse(pins));
    }, []);

    return (
        <div className="select-none grow rounded-xl border-solid border-2 border-sky-100 dark:border-slate-800 mb-6 p-4 bg-white dark:bg-slate-900 min-h-fit">
            <div
                className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] p-5 gap-4 overflow-y-auto max-h-[82vh]"
                aria-label="metrics"
            >
                {grid().map((tile) => (
                    <motion.div layout key={tile.idx}>
                        <Card
                            onChange={onPin}
                            idx={tile.idx}
                            pin={pinned ? pinned[tile.idx] : false}
                        >
                            <div
                                className="relative dark:bg-slate-800 text-sky-900 dark:text-slate-300 fill-sky-900 dark:fill-slate-300"
                                id={`graph-container-${tile.idx}`}
                            ></div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default MetricView;

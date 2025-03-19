import { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { useOutletContext } from 'react-router';
import fetchJSONData from '../components/JsonFetch';
import graph from '../components/Grapher';

function MetricView() {
    const pdfInfo = useOutletContext();
    const [csvURL, setCsvURL] = useState(pdfInfo.url.annotated.csv); //alrdy a download url
    const [jsonPath, setJsonPath] = useState(
        pdfInfo?.path.annotated.csv
            ? pdfInfo.path.annotated.csv.split('.')[0] + '.json'
            : null,
    );

    const defaultGraphTypes = ["bar", "bar", "text", "histogram", "pie"]
    const defaultOptions = [{1: "Shape"}, {1: "Size", 2: true}, {1: "Sum", 2: "WeightFT"}, {1: "Length"}, {1: "Size", 2: true}]
    const [defaultMetricLength, setDefaultMetricLength] = useState(5); //default 4 overview graphs

    const [pinned, setPinned] = useState(null);
    const [data, setData] = useState([]);

    const generateGraphs = () => {

        for (let idx = 0; idx < defaultMetricLength; idx++) {
            const container = document.getElementById(`graph-container-${idx}`);
            graph(container, data, defaultGraphTypes[idx], defaultOptions[idx]);
        }
    }

    const onPin = (key) => {
        let set = {...pinned};
        if (!set[key]) {
            set[key] = true;
        } else {
            delete set[key];
        }

        setPinned(set);
        localStorage.setItem("pinned", JSON.stringify(set));
    };

    const grid = () => {

        let ordered = [];
        let map = {};

        if(pinned)
        {
            Object.keys(pinned).forEach((key) =>
                {
                ordered.push({ idx: key })
                map[key] = true;
                }
            );
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
            const pins = localStorage.getItem("pinned");
            setPinned(JSON.parse(pins));
        }, []);

    return (
        <div className="select-none rounded-md border-solid border-2 border-sky-500 mx-2 mb-2 p-2 h-full bg-white">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] p-5 gap-4" aria-label="metrics">
                {grid().map((tile) => (
                    <Card onChange={onPin} key={tile.idx} idx={tile.idx} pin={pinned? pinned[tile.idx] : false}>
                        <div className="relative" id={`graph-container-${tile.idx}`}></div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default MetricView;

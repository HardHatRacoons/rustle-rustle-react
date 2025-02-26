import { useState } from 'react';
import Card from '../components/Card';

function MetricView() {
    const [metrics, setMetrics] = useState(['1', '2', '3']);
    const [pinned, setPinned] = useState(new Set());
    const onPin = (pin, key) => {
        let set = new Set(pinned);
        if (pin) {
            set.add(key);
        } else {
            set.delete(key);
        }
        setPinned(set);
    };

    const grid = () => {
        let ordered = [];

        pinned.forEach((key) =>
            ordered.push({ metric: metrics[key], idx: key }),
        );
        for (let idx = 0; idx < metrics.length; idx++) {
            if (!pinned.has(idx)) ordered.push({ metric: metrics[idx], idx });
        }

        return ordered;
    };

    return (
        <div className="select-none rounded-md border-solid border-2 border-sky-500 mx-2 mb-2 p-2 h-full bg-white">
            <div className="grid grid-cols-3 p-5 gap-4" aria-label="metrics">
                {grid().map((tile) => (
                    <Card onChange={onPin} key={tile.idx} idx={tile.idx}>
                        {tile.metric}
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default MetricView;

import { useState } from 'react';

function MetricView() {

  const [activeTab, setActiveTab] = useState('');

  return (
    <div className="select-none rounded-md border-solid border-2 border-sky-500 mx-2 mb-2 p-2 bg-white ">
        metric part
    </div>
  )
}

export default MetricView
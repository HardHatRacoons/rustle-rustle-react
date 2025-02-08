import { useState } from 'react';

function BPView() {

  const [activeTab, setActiveTab] = useState('');

  return (
    <div className="select-none rounded-md border-solid border-2 border-sky-500 mx-2 mb-2 p-2 bg-white ">
        bp part
    </div>
  )
}

export default BPView
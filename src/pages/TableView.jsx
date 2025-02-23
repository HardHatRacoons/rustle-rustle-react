import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);


function TableView() {

  // Row Data: The data to be displayed.
      const [rowData, setRowData] = useState([
          { make: "Tesla", model: "Model Y", price: 64950, electric: true },
          { make: "Ford", model: "F-Series", price: 33850, electric: false },
          { make: "Toyota", model: "Corolla", price: 29600, electric: false },
      ]);

      // Column Definitions: Defines the columns to be displayed.
      const [colDefs, setColDefs] = useState([
          { field: "make" },
          { field: "model" },
          { field: "price" },
          { field: "electric" }
      ]);

  return (
    <div className="select-none h-full rounded-md border-solid border-2 border-sky-500 mx-2 mb-2 p-2 bg-white" aria-label="table">
        <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
        />
    </div>
  )
}

export default TableView
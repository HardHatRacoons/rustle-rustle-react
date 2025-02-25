import { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);


function TableView() {

  // Row Data: The data to be displayed.
      const [rowData, setRowData] = useState([
          { id: 1, 'beam/column': true, type: "22x4", description: "idk", notes: "stinky beam" },
          { id: 2, 'beam/column': true, type: "21x3", description: "idk", notes: "hates cats" },
          { id: 3, 'beam/column': false, type: "22x4", description: "idk", notes: "only child" },
      ]);

      // Column Definitions: Defines the columns to be displayed.
      const [colDefs, setColDefs] = useState([
          { field: "id", cellDataType: 'number', filter: true },
          { field: "beam/column", cellDataType: 'text', filter: true,
            valueFormatter: p => { return p.value? "beam": "column"; }
          },
          { field: "type", cellDataType: 'text', filter: true, sortable: true },
          { field: "description", cellDataType: 'text' },
          { field: "notes", cellDataType: 'text', sortable: false, flex: 1 }
      ]);

    const rowSelection = useMemo(() => {
    	return {
            mode: 'multiRow',
            headerCheckbox: false,
            enableClickSelection: true,
        };
    }, []);

// const gridOptions = {
//     autoSizeStrategy: {
//         type: 'fitGridWidth',
//         defaultMinWidth: 100,
//         columnLimits: [
//             {
//                 colId: 'country',
//                 minWidth: 900
//             }
//         ]
//     },
//
//     // other grid options ...
// }

  return (
    <div className="select-none h-full rounded-md border-solid border-2 border-sky-500 mx-2 mb-2 p-2 bg-white" aria-label="table">
        <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            pagination={true}
            rowSelection={rowSelection}
        />
    </div>
  )
}

export default TableView

import { useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useOutletContext } from 'react-router';

import * as d3 from 'd3';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

function TableView() {
    const pdfURL = useOutletContext();
    //const csv = "/20250225_132329_BBBB_PK-8_School_Core.csv"

    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([]);

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        { headerName: 'Page Number', field: 'PageNumber', cellDataType: 'number', filter: true, sortable: true },
        { headerName:'Area Name', field: 'AreaName', cellDataType: 'text', filter: true, sortable: true, flex: 1 },
        { field: 'Quantity', cellDataType: 'number', filter: true, sortable: true },
        { field: 'Shape', cellDataType: 'text', filter: true, sortable: true },
        { field: 'Size', cellDataType: 'text', filter: true, sortable: true },
        { field: 'Length', cellDataType: 'number', filter: true, sortable: true,
        valueFormatter: p => p.value.toFixed(2) },
        { headerName:'Weight (FT)', field: 'WeightFT', cellDataType: 'number', filter: true, sortable: true,
        valueFormatter: p => p.value.toFixed(2) },
        { headerName:'Weight (EA)',field: 'WeightEA', cellDataType: 'number', filter: true, sortable: true,
        valueFormatter: p => p.value.toFixed(2) },
        { headerName:'Top Of Steel',field: 'TopOfSteel', cellDataType: 'number', filter: true, sortable: true },
        { field: 'GUID', cellDataType: 'text', filter: true, sortable: true, minWidth: 250 },
    ]);

    const rowSelection = useMemo(() => {
        return {
            mode: 'multiRow',
            headerCheckbox: false,
            enableClickSelection: true,
        };
    }, []);

    const autoSizeStrategy =  {
            type: 'fitCellContents',
        }


  useEffect(() => {
    // Fetch the CSV file from the URL
    const fetchCsvData = async () => {
      try {
        const response = await fetch('/20250225_132329_BBBB_PK-8_School_Core.csv');
        if (!response.ok) {
          throw new Error('Failed to fetch CSV file');
        }

        const csvData = await response.text(); // Read response as text

        // Parse CSV using D3.js
        const parsedData = d3.csvParse(csvData, d3.autoType);

        // Set the parsed JSON data in state
        setRowData(parsedData);
      } catch (err) {
        setError(err.message);  // Set error message if any
      } finally {
        //setLoading(false);  // Set loading to false after fetch is complete
      }
    };

    fetchCsvData();  // Trigger the fetch operation
  }, []);

    return (
        <div
            className="select-none h-full rounded-md border-solid border-2 border-sky-500 mx-2 mb-2 p-2 bg-white"
            aria-label="table"
        >
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                pagination={true}
                paginationAutoPageSize={true}
                rowSelection={rowSelection}
                autoSizeStrategy={autoSizeStrategy}
            />
        </div>
    );
}

export default TableView;

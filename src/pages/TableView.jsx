import { useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useOutletContext } from 'react-router';
import { uploadData, getUrl } from 'aws-amplify/storage';

import * as d3 from 'd3';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

function TableView() {
    const pdfInfo = useOutletContext();
    const csvPath = pdfInfo.path.annotated.csv;
    const [csvURL, setCsvURL] = useState(pdfInfo.url.annotated.csv); //alrdy a download url
    const [jsonPath, setJsonPath] = useState(
        csvPath ? csvPath.split('.')[0] + '.json' : null,
    );

    const [rowData, setRowData] = useState([]);

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        {
            headerName: 'Page Number',
            field: 'PageNumber',
            cellDataType: 'number',
            filter: true,
            sortable: true,
        },
        {
            headerName: 'Area Name',
            field: 'AreaName',
            cellDataType: 'text',
            filter: true,
            sortable: true,
            flex: 1,
        },
        {
            field: 'Quantity',
            cellDataType: 'number',
            filter: true,
            sortable: true,
        },
        { field: 'Shape', cellDataType: 'text', filter: true, sortable: true },
        { field: 'Size', cellDataType: 'text', filter: true, sortable: true },
        {
            field: 'Length',
            cellDataType: 'number',
            filter: true,
            sortable: true,
            valueFormatter: (p) => p.value?.toFixed(2),
        },
        {
            headerName: 'Weight (FT)',
            field: 'WeightFT',
            cellDataType: 'number',
            filter: true,
            sortable: true,
            valueFormatter: (p) => p.value?.toFixed(2),
        },
        {
            headerName: 'Weight (EA)',
            field: 'WeightEA',
            cellDataType: 'number',
            filter: true,
            sortable: true,
            valueFormatter: (p) => p.value?.toFixed(2),
        },
        {
            headerName: 'Top Of Steel',
            field: 'TopOfSteel',
            cellDataType: 'number',
            filter: true,
            sortable: true,
        },
        {
            field: 'GUID',
            cellDataType: 'text',
            filter: true,
            sortable: true,
            minWidth: 250,
        },
    ]);

    const rowSelection = useMemo(() => {
        return {
            mode: 'multiRow',
            headerCheckbox: false,
            enableClickSelection: true,
        };
    }, []);

    const autoSizeStrategy = {
        type: 'fitCellContents',
    };

    useEffect(() => {
        // Fetch the CSV file from the URL
        const fetchCsvData = async () => {
            try {
                const response = await fetch(csvURL);
                if (!response.ok) {
                    throw new Error('Failed to fetch CSV file');
                }

                const csvData = await response.text(); // Read response as text

                // Parse CSV using D3.js
                const parsedData = d3.csvParse(csvData, d3.autoType);

                setRowData(parsedData);

                //create new file
                uploadData({
                    path: jsonPath,
                    data: JSON.stringify(parsedData),
                });
            } catch (error) {
                //setError(err.message);  // Set error message if any
                console.log(error);
            } finally {
                //setLoading(false);  // Set loading to false after fetch is complete
            }
        };

        const fetchJSONData = async () => {
            if (!csvURL || !jsonPath) return;
            try {
                let linkToStorageFile = await getUrl({
                    path: jsonPath,
                    options: {
                        bucket: 'raccoonTeamDrive',
                        validateObjectExistence: true,
                        // url expiration time in seconds.
                        expiresIn: 900,
                    },
                });

                if (!linkToStorageFile) {
                    throw new Error('Failed to fetch JSON file');
                }

                const response = await fetch(linkToStorageFile.url.toString());
                if (!response.ok) {
                    throw new Error('Failed to fetch CSV file');
                }
                //console.log('found file')
                const jsonData = await response.json(); // Read response as text
                //console.log(jsonData)

                // Set the parsed JSON data in state
                setRowData(jsonData);
            } catch (error) {
                //if cant find file
                if (error.message === 'NotFound') fetchCsvData();
                else console.error('Unexpected error: ' + error.message);
            }
        };

        fetchJSONData();
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

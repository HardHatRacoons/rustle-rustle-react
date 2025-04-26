import { useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useOutletContext } from 'react-router';
import fetchJSONData from '../components/JsonFetch';

import * as d3 from 'd3';

//register all Community features of aggrid
ModuleRegistry.registerModules([AllCommunityModule]);

/*
 * The table view for a file.
 *
 * @component
 * @returns {React.ReactElement} the rendered table view.
 */
function TableView() {
    const { pdfInfo } = useOutletContext();
    const [csvURL, setCsvURL] = useState(pdfInfo?.url.annotated.csv); //alrdy a download url
    const [jsonPath, setJsonPath] = useState(
        pdfInfo?.path.annotated.csv
            ? pdfInfo.path.annotated.csv.split('.')[0] + '.json'
            : null,
    );

    const [rowData, setRowData] = useState([]);

    //defines the columns to be displayed.
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

    //row selection detailing
    const rowSelection = useMemo(() => {
        return {
            mode: 'multiRow',
            headerCheckbox: false,
            enableClickSelection: true,
        };
    }, []);

    //cell sizing is automatic
    const autoSizeStrategy = {
        type: 'fitCellContents',
    };

    useEffect(() => {
        fetchJSONData(csvURL, jsonPath, setRowData);
    }, [jsonPath]);

    useEffect(() => {
        const json = pdfInfo?.path.annotated.csv
            ? pdfInfo.path.annotated.csv.split('.')[0] + '.json'
            : null;
        setJsonPath(json);
        setCsvURL(pdfInfo?.url.annotated.csv);
    }, [pdfInfo]);

    return (
        <div
            className="select-none grow rounded-xl border-solid border-2 border-sky-100 mb-6 p-4 bg-white dark:bg-slate-900 dark:border-slate-800"
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

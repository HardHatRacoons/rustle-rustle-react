import { uploadData, getUrl } from 'aws-amplify/storage';
import * as d3 from 'd3';

const fetchCsvData = async (csvURl, jsonPath, setData) => {
    try {
        const response = await fetch(csvURL);

        if (!response.ok) {
            throw new Error('Failed to fetch CSV file');
        }

        const csvData = await response.text(); // Read response as text

        // Parse CSV using D3.js
        const parsedData = d3.csvParse(csvData, d3.autoType);

        setData(parsedData);

        //create new file
        uploadData({
            path: jsonPath,
            data: JSON.stringify(parsedData),
        });
    } catch (error) {
        console.error('Unexpected CSV error: ' + error);
    }
};

const fetchJSONData = async (csvURL, jsonPath, setData) => {
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
            throw new Error('Failed to fetch JSON URL');
        }

        const response = await fetch(linkToStorageFile.url.toString());

        if (!response.ok) {
            throw new Error('Failed to fetch JSON file');
        }
        //console.log('found file')
        const jsonData = await response.json(); // Read response as text
        // Set the parsed JSON data in state
        setData(jsonData);
    } catch (error) {
        //if cant find file
        if (error.message === 'NotFound')
            fetchCsvData(csvURl, jsonPath, setRowData);
        else console.error('Unexpected JSON error: ' + error.message);
    }
};

export default fetchJSONData;

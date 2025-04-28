import { uploadData, getUrl } from 'aws-amplify/storage';
import * as d3 from 'd3';

/*
 * Fetches the csv data and converts it to a json, which is then uploaded for future reference.
 *
 * @function
 * @param {String} csvURL The csv data url.
 * @param {Array} jsonPath The json path url.
 * @param {(value: object | function): void} setData A setter part of a useState to set data.
 */
const fetchCsvData = async (csvURL, jsonPath, setData) => {
    try {
        //fetch csv
        const response = await fetch(csvURL);

        if (!response.ok) {
            throw new Error('Failed to fetch CSV file');
        }

        const csvData = await response.text(); // Read response as text

        //parse csv using D3.js
        const parsedData = d3.csvParse(csvData, d3.autoType);

        setData(parsedData);

        //create new json file
        uploadData({
            path: jsonPath,
            data: JSON.stringify(parsedData),
        });
    } catch (error) {
        console.error('Unexpected CSV error: ' + error);
    }
};

/*
 * Fetches the json data; if dne, fetches the csv throw a call to a different function.
 *
 * @function
 * @param {String} csvURL The csv data url.
 * @param {Array} jsonPath The json path url.
 * @param {(value: object | function): void} setData A setter part of a useState to set data.
 */
const fetchJSONData = async (csvURL, jsonPath, setData) => {
    if (!csvURL || !jsonPath) return; //return if invalid call

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

        const jsonData = await response.json(); // Read response as text

        // Set the parsed JSON data in state
        setData(jsonData);
    } catch (error) {
        //if cant find json file get csv data
        if (error.message === 'NotFound')
            fetchCsvData(csvURL, jsonPath, setData);
        else console.error('Unexpected JSON error: ' + error.message);
    }
};

export default fetchJSONData;

const { v4: generateId } = require('uuid');

const { NotFoundError } = require('../util/errors');
const { readData, writeData } = require('./util');

const fs = require('fs');
const https = require('https');
const http = require('http');

async function getAll() {
  const storedData = await readData();
  if (!storedData.jobs) {
    console.log('stored data=====', storedData);
    
    throw new NotFoundError('Could not find any jobs.');
  }
  return storedData.jobs;
}

async function get(id) {
  const storedData = await readData();
  if (!storedData.jobs || storedData.jobs.length === 0) {
    throw new NotFoundError('Could not find any jobs.');
  }

  const job = storedData.jobs.find((ev) => ev.id === id);
  if (!job) {
    throw new NotFoundError('Could not find job for id ' + id);
  }

  return job;
}

async function add(data) {
  const storedData = await readData();
  storedData.jobs.unshift({ ...data, id: generateId() });
  await writeData(storedData);
}

async function replace(id, data) {
  const storedData = await readData();
  if (!storedData.jobs || storedData.jobs.length === 0) {
    throw new NotFoundError('Could not find any jobs.');
  }

  const index = storedData.jobs.findIndex((ev) => ev.id === id);
  if (index < 0) {
    throw new NotFoundError('Could not find job for id ' + id);
  }

  storedData.jobs[index] = { ...data, id };

  await writeData(storedData);
}

async function remove(id) {
  const storedData = await readData();
  const updatedData = storedData.jobs.filter((ev) => ev.id !== id);
  await writeData({ ...storedData, jobs: updatedData });
}

async function convertCsvToJsonManual0(csvFilePath, jsonFilePath) {
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const jsonData = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            const obj = {};
            
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });
            
            jsonData.push(obj);
        }
    }
    
    await fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
    console.log('CSV successfully converted to JSON');
}

async function convertCsvToJsonManual1(csvUrl, jsonFilePath) {
    // Determine which module to use based on URL protocol
    const client = csvUrl.startsWith('https://') ? https : http;
    
    client.get(csvUrl, (response) => {
        let csvData = '';
        
        // Handle redirects
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            console.log('Redirecting to:', response.headers.location);
            csvToJsonFromUrl(response.headers.location, jsonFilePath);
            return;
        }
        
        // Check if request was successful
        if (response.statusCode !== 200) {
            console.error(`Failed to fetch CSV. Status code: ${response.statusCode}`);
            return;
        }
        
        // Collect data chunks
        response.on('data', (chunk) => {
            csvData += chunk;
        });
        
        // Process data when complete
        response.on('end', async () => {
            try {
                const lines = csvData.split('\n');
                const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                
                const jsonData = [];
                
                for (let i = 1; i < lines.length; i++) {
                    if (lines[i].trim()) {
                        // Handle CSV parsing with quoted values
                        const values = parseCSVLine(lines[i]);
                        const obj = {};
                        
                        headers.forEach((header, index) => {
                            obj[header] = values[index] || '';
                        });
                        
                        jsonData.push(obj);
                    }
                }
                
                await fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
                console.log('CSV successfully converted to JSON from URL');
                console.log(`Records processed: ${jsonData.length}`);
            } catch (error) {
                console.error('Error processing CSV data:', error.message);
            }
        });
        
    }).on('error', (error) => {
        console.error('Error fetching CSV from URL:', error.message);
    });
}

// Helper function to parse CSV line with quoted values
function parseCSVLine1(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim().replace(/"/g, ''));
            current = '';
        } else {
            current += char;
        }
    }
    
    // Add the last value
    values.push(current.trim().replace(/"/g, ''));
    return values;
}

function convertCsvToJsonManual(csvUrl, jsonFilePath) {
    // Determine which module to use based on URL protocol
    const client = csvUrl.startsWith('https://') ? https : http;
    
    client.get(csvUrl, (response) => {
        let csvData = '';
        
        // Handle redirects
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            console.log('Redirecting to:', response.headers.location);
            csvToJsonFromUrl(response.headers.location, jsonFilePath);
            return;
        }
        
        // Check if request was successful
        if (response.statusCode !== 200) {
            console.error(`Failed to fetch CSV. Status code: ${response.statusCode}`);
            return;
        }
        
        // Collect data chunks
        response.on('data', (chunk) => {
            csvData += chunk;
        });
        
        // Process data when complete
        response.on('end', async() => {
            try {
                const lines = csvData.split('\n');
                const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                
                const jsonData = [];
                
                for (let i = 1; i < lines.length; i++) {
                    if (lines[i].trim()) {
                        // Handle CSV parsing with quoted values
                        const values = parseCSVLine(lines[i]);
                        const obj = {};
                        
                        headers.forEach((header, index) => {
                            obj[header] = values[index] || '';
                        });
                        
                        jsonData.push(obj);
                    }
                }
                
                // Wrap the array in an object with 'jobs' key
                const wrappedData = {
                    jobs: jsonData
                };
                
                await fs.writeFileSync(jsonFilePath, JSON.stringify(wrappedData, null, 2));
                console.log('CSV successfully converted to JSON from URL');
                console.log(`Records processed: ${jsonData.length}`);
            } catch (error) {
                console.error('Error processing CSV data:', error.message);
            }
        });
        
    }).on('error', (error) => {
        console.error('Error fetching CSV from URL:', error.message);
    });
}

// Helper function to parse CSV line with quoted values
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim().replace(/"/g, ''));
            current = '';
        } else {
            current += char;
        }
    }
    
    // Add the last value
    values.push(current.trim().replace(/"/g, ''));
    return values;
}

exports.getAll = getAll;
exports.get = get;
exports.add = add;
exports.replace = replace;
exports.remove = remove;
exports.convertCsvToJsonManual = convertCsvToJsonManual;
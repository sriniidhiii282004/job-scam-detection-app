const fs = require('node:fs/promises');

async function readData() {
  const data = await fs.readFile('jobs.json', 'utf8');
  return JSON.parse(data);
}

async function writeData(data) {
  await fs.writeFile('jobs.json', JSON.stringify(data));
}

async function readUserData() {
  const filePath = 'users.json';
  try {

      // Read the file
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, create it with empty structure
            const initialData = { users: [] };
            await fs.writeFile(filePath, JSON.stringify(initialData, null, 2));
            console.log('users.json created with initial structure');
            return initialData;
        } else {
            // Some other error occurred
            // throw error;
             console.log('users.json some other error', error);
        }
    }
}

async function writeUserData(data) {
  await fs.writeFile('users.json', JSON.stringify(data));
}

exports.readData = readData;
exports.writeData = writeData;
exports.readUserData = readUserData;
exports.writeUserData = writeUserData;
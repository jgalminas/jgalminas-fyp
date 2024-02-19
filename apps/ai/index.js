const { spawnSync } = require('child_process');
const fs = require('fs');

/**
 * Used for testing the python script
 */

const data = fs.readFileSync('./test_match.json', 'utf-8');

const input = {
    puuid: "Yd5iuNMv_8KkEwpOcdzlLv9u6OuKVi6rPOIENOMp6edGzHdkNO5DCFXWxRDZdeASj-_8AE-Mpbq_AA",
    data: data
}

const tempFilePath = './test_input.json';

// Write JSON data to a temporary file
fs.writeFileSync(tempFilePath, JSON.stringify(input), {
    encoding: 'utf-8'
});

// Execute the command with the file path as an argument
const proc = spawnSync('py', ['./main.py', tempFilePath]);

// Remove the temporary file after execution
fs.unlinkSync(tempFilePath);

console.log(proc.stdout.toString());
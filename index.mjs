import { open } from 'node:fs/promises';
import fs from 'node:fs';
import Papa from 'papaparse';

const strengthData = await splitApartBackupFile('Strength');
const cardioData = await splitApartBackupFile('Cardio');
// splitApartBackupFile('Weight');

console.log(strengthData);

if (!fs.existsSync('output')) {
    fs.mkdirSync('output');
}
fs.writeFileSync('output/strength.json', JSON.stringify(strengthData));
fs.writeFileSync('output/cardio.json', JSON.stringify(cardioData));


async function splitApartBackupFile(sectionName) {
    const file = await open('./workoutlog.csv');
    const data = [];
    let currentSection = false;
    let isSectionDivider = false;

    for await (const line of file.readLines()) {
        if (line == '-----' + sectionName + '-----') { currentSection = true; isSectionDivider = true; }
        else if (line.startsWith('-----')) { currentSection = false; }

        if (!isSectionDivider && currentSection) { data.push(line); }

        isSectionDivider = false;
    }

    return Papa.parse(data.join('\r\n'), { header: true, dynamicTyping: true }).data;
}
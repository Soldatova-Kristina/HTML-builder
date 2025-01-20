const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');

fs.access(filePath, (err) => {
  if (err) {
    console.error('File does not exist:', filePath);
    return;
  }

  const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

  let data = '';

  readStream.on('data', (chunk) => {
    data += chunk;
  });

  readStream.on('end', () => {
    console.log('Reading is complete');
    console.log(data);
  });

  readStream.on('error', (error) => {
    console.error('File read error:', error.message);
  });
});

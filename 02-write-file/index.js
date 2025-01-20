const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, {
  flags: 'a',
  encoding: 'utf-8',
});

writeStream.on('error', (err) => {
  console.error('Failed to create write stream:', err.message);
  process.exit(1);
});

console.log(
  'Enter the text to be written to the file. To exit, type "exit" or press Ctrl + C',
);

function exitHandler() {
  console.log('\nCompleted. Thanks for using it! Bye!');
  process.exit();
}

process.stdin.on('data', (text) => {
  const input = text.toString().trim();

  if (input.toLowerCase() === 'exit') {
    exitHandler();
  }

  writeStream.write(input + '\n', (err) => {
    if (err) {
      console.error('Error writing to file:', err.message);
    } else {
      console.log('The text is written. Continue typing');
    }
  });
});

process.on('SIGINT', exitHandler);

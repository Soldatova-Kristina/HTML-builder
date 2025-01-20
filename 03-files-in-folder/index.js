const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.stat(folderPath, (err, stats) => {
  if (err || !stats.isDirectory()) {
    return console.error(`Invalid folder path: "${folderPath}"`);
  }

  fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return console.error(
        `Error reading the folder "${folderPath}": ${err.message}`,
      );
    }

    if (files.length === 0) {
      console.log(`The folder "${folderPath}" is empty.`);
      return;
    }

    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileName = path.parse(file.name).name;
        const fileExt = path.extname(file.name).slice(1);

        fs.stat(filePath, (err, stats) => {
          if (err) {
            return console.error(
              'Error receiving file information:',
              err.message,
            );
          }

          const fileSize = (stats.size / 1024).toFixed(2);
          console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
        });
      }
    });
  });
});

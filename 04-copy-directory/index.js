const fs = require('fs');
const path = require('path');

const sourceDirectory = path.join(__dirname, 'files');
const destinationDirectory = path.join(__dirname, 'files-copy');

function copyDirectory(srcDir, destDir) {
  fs.rm(destDir, { recursive: true, force: true }, (err) => {
    if (err) return console.error('Error removing directory:', err.message);

    fs.mkdir(destDir, { recursive: true }, (err) => {
      if (err) return console.error('Error creating directory:', err.message);

      fs.readdir(srcDir, { withFileTypes: true }, (err, items) => {
        if (err) return console.error('Error reading directory:', err.message);

        let completed = 0;
        if (items.length === 0) {
          console.log('Source directory is empty. Nothing to copy.');
          return;
        }

        items.forEach((item) => {
          const srcPath = path.join(srcDir, item.name);
          const destPath = path.join(destDir, item.name);

          if (item.isDirectory()) {
            copyDirectory(srcPath, destPath);
          } else if (item.isFile()) {
            fs.copyFile(srcPath, destPath, (err) => {
              if (err) return console.error('Error copying file:', err.message);

              completed++;
              if (completed === items.length) {
                console.log('All files copied successfully!');
              }
            });
          }
        });
      });
    });
  });
}

copyDirectory(sourceDirectory, destinationDirectory);

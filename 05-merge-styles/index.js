const fs = require('fs');
const path = require('path');

const sourceFolder = path.join(__dirname, 'styles');
const targetFolder = path.join(__dirname, 'project-dist');
const outputFilePath = path.join(targetFolder, 'bundle.css');

async function mergeStyles() {
  try {
    await fs.promises.mkdir(targetFolder, { recursive: true });

    const output = fs.createWriteStream(outputFilePath);
    const items = await fs.promises.readdir(sourceFolder);

    for (const item of items) {
      const itemPath = path.join(sourceFolder, item);
      const itemExt = path.extname(item);

      const stats = await fs.promises.stat(itemPath);
      if (stats.isFile() && itemExt === '.css') {
        const content = await fs.promises.readFile(itemPath, 'utf8');
        output.write(content + '\n');
      }
    }

    output.end(() => {
      console.log('Done! Styles have been successfully merged!');
    });
  } catch (error) {
    console.error('Error during merging:', error.message);
  }
}

mergeStyles()
  .then(() => console.log('MergeStyles function executed successfully.'))
  .catch((error) =>
    console.error('Error in mergeStyles function:', error.message),
  );

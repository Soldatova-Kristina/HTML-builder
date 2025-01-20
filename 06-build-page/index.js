const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const assetsSource = path.join(__dirname, 'assets');
const assetsTarget = path.join(projectDist, 'assets');
const stylesSource = path.join(__dirname, 'styles');
const templateFile = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');
const indexFile = path.join(projectDist, 'index.html');
const styleFile = path.join(projectDist, 'style.css');

async function buildPage() {
  try {
    await fs.promises.rm(projectDist, { recursive: true, force: true });
    await fs.promises.mkdir(projectDist, { recursive: true });

    let templateContent = await fs.promises.readFile(templateFile, 'utf-8');
    const components = await fs.promises.readdir(componentsFolder);

    for (const component of components) {
      const componentExt = path.extname(component);
      const componentName = path.basename(component, componentExt);
      if (componentExt === '.html') {
        const componentPath = path.join(componentsFolder, component);
        const componentContent = await fs.promises.readFile(
          componentPath,
          'utf-8',
        );
        const regex = new RegExp(`{{${componentName}}}`, 'g');
        if (regex.test(templateContent)) {
          templateContent = templateContent.replace(regex, componentContent);
        } else {
          console.warn(
            `Warning: Tag {{${componentName}}} not found in template.html`,
          );
        }
      }
    }

    await fs.promises.writeFile(indexFile, templateContent);

    const styles = await fs.promises.readdir(stylesSource);
    const cssContent = [];
    for (const style of styles) {
      const styleExt = path.extname(style);
      if (styleExt === '.css') {
        const stylePath = path.join(stylesSource, style);
        const styleData = await fs.promises.readFile(stylePath, 'utf-8');
        cssContent.push(styleData);
      }
    }

    await fs.promises.writeFile(styleFile, cssContent.join('\n'));

    // eslint-disable-next-line no-inner-declarations
    async function copyAssets(src, dest) {
      await fs.promises.mkdir(dest, { recursive: true });
      const items = await fs.promises.readdir(src, { withFileTypes: true });
      await Promise.all(
        items.map(async (item) => {
          const srcPath = path.join(src, item.name);
          const destPath = path.join(dest, item.name);
          if (item.isDirectory()) {
            await copyAssets(srcPath, destPath);
          } else {
            await fs.promises.copyFile(srcPath, destPath);
          }
        }),
      );
    }
    await copyAssets(assetsSource, assetsTarget);

    console.log('Build completed successfully!');
  } catch (err) {
    console.error('Error during build:', err.message);
  }
}

buildPage()
  .then(() => {
    console.log('Build process finished without issues.');
  })
  .catch((error) => {
    console.error('Build process failed:', error.message);
  });

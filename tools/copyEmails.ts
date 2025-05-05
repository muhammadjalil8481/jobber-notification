// scripts/copyEmails.ts

import shell from 'shelljs';

// Define the source and destination directories
const srcFolder = 'src/emails';
const destFolder = 'dist/emails';

// Check if the source folder exists
if (shell.test('-d', srcFolder)) {
  // Create the destination folder if it doesn't exist
  shell.mkdir('-p', destFolder);

  // Copy the contents of the emails folder recursively
  shell.cp('-R', `${srcFolder}/*`, destFolder);
  console.log(`Successfully copied ${srcFolder} to ${destFolder}`);
} else {
  console.error(`Source folder ${srcFolder} does not exist!`);
  process.exit(1); // Exit with an error code if the source folder doesn't exist
}

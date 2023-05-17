import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomInt } from 'crypto';

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);
const text = 'The Wind in the Willows (introductory fragment).txt';

const readStream = fs.createReadStream(path.join(__dirname, '/files', text));
const outPut = path.join(__dirname, '/files', 'output.txt');
const writeStream = fs.createWriteStream(outPut);

const textIn = 'Introductory fragment, copying is prohibited!';

readStream.on('data', (chunk) => {
  const lines = chunk.toString().split('\n');
  const outputLines = [];

  lines.forEach((line) => {
    outputLines.push(line);

    if (randomInt(0, 2)) {
      outputLines.push(textIn);
    }
  });

  const outputContent = outputLines.join('\n');
  writeStream.write(outputContent);
});

readStream.on('end', () => {
  writeStream.end();
});

writeStream.on('finish', () => {
  console.log('Finished writing text.');
});

function bringOutConsole(value) {
  process.stdout.write(value + '\n');
}

bringOutConsole('Hello');

const ask = (question) => {
  return new Promise((resolve, reject) => {
    process.stdout.write(question);

    const onData = (data) => {
      const answer = data.toString().trim().toLowerCase();
      if (['y', 'yes', 'n', 'no'].includes(answer)) {
        process.stdin.removeListener('data', onData);
        resolve(answer);
      } else {
        reject(new Error('ERROR'));
      }
    };

    process.stdin.on('data', onData);
  });
};

(async () => {
  try {
    const scssAnswer = await ask('Do you want to use SCSS? (Y/N): ');
    const eslintAnswer = await ask('Do you want to use ESLint? (Y/N): ');

    console.log('\nYour answers:');
    console.log('SCSS:', scssAnswer);
    console.log('ESLint:', eslintAnswer);
  } catch (error) {
    console.error(error.message);
  } finally {
    process.exit();
  }
})();

import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test file upload to see diagnostic logs
const testImagePath = path.join(__dirname, 'attached_assets', 'service_images', 'unknown-1758160485489.jpg');

console.log('Testing file upload with diagnostic logs...');
console.log('Using test image:', testImagePath);

const curlCommand = `curl -X POST http://localhost:5000/api/services/upload-image -F "image=@${testImagePath.replace(/\\/g, '/')}" -F "serviceSlug=ducha-aspirado"`;

console.log('Executing:', curlCommand);

exec(curlCommand, (error, stdout, stderr) => {
  console.log('STDOUT:', stdout);
  if (stderr) {
    console.log('STDERR:', stderr);
  }
  if (error) {
    console.error('ERROR:', error);
  }
});
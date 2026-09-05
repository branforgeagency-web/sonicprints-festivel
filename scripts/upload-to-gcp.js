import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root paths
const ROOT_DIR = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(ROOT_DIR, 'client', 'public', 'assets', 'img');

// MIME types map
const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};

// Parse command line flags
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

function getArgValue(flag) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  return null;
}

const defaultKeyFile = fs.existsSync(path.join(ROOT_DIR, 'gcp-key.json')) ? path.join(ROOT_DIR, 'gcp-key.json') : null;
const bucketName = getArgValue('--bucket') || process.env.GCP_BUCKET_NAME || 'sonicprints-assets';
const keyFilePath = getArgValue('--key') || process.env.GCP_KEY_FILE || process.env.GOOGLE_APPLICATION_CREDENTIALS || defaultKeyFile;
const remotePrefix = (getArgValue('--prefix') || process.env.GCP_STORAGE_PREFIX || 'assets/img').replace(/^\/+|\/+$/g, '');

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function main() {
  console.log('='.repeat(65));
  console.log('  Sonic Prints — Google Cloud Storage (GCP) Asset Uploader');
  console.log('='.repeat(65));
  console.log(`Source directory : ${ASSETS_DIR}`);
  console.log(`Target prefix    : ${remotePrefix}/`);
  console.log(`Dry run mode     : ${isDryRun ? 'YES (No files will be uploaded)' : 'NO'}`);
  console.log('-'.repeat(65));

  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`❌ Error: Source directory does not exist: ${ASSETS_DIR}`);
    process.exit(1);
  }

  const files = getAllFiles(ASSETS_DIR);
  if (files.length === 0) {
    console.warn('⚠️  No files found to upload.');
    return;
  }

  let totalBytes = 0;
  const uploadQueue = files.map(file => {
    const relPath = path.relative(ASSETS_DIR, file).replace(/\\/g, '/');
    const destination = `${remotePrefix}/${relPath}`;
    const ext = path.extname(file).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const size = fs.statSync(file).size;
    totalBytes += size;
    return { file, relPath, destination, contentType, size };
  });

  console.log(`Found ${uploadQueue.length} files (${formatBytes(totalBytes)}) to process.\n`);

  if (isDryRun) {
    console.log('🔍 [DRY RUN] Preview of uploads:');
    uploadQueue.forEach((item, index) => {
      console.log(`  [${index + 1}/${uploadQueue.length}] ${item.destination} (${formatBytes(item.size)}, ${item.contentType})`);
    });
    console.log('\n' + '='.repeat(65));
    console.log(`✅ Dry run complete! ${uploadQueue.length} files verified (${formatBytes(totalBytes)}).`);
    console.log('To execute the real upload, set your bucket credentials and run:');
    console.log('  npm run upload:gcp -- --bucket <YOUR_BUCKET_NAME> --key <PATH_TO_GCP_KEY.json>');
    console.log('='.repeat(65));
    return;
  }

  // Real upload requires GCP bucket & credentials
  if (!bucketName) {
    console.error('❌ Error: GCP Bucket name is required!');
    console.error('Provide it via --bucket <name> or GCP_BUCKET_NAME environment variable.');
    console.error('\nExample:');
    console.error('  npm run upload:gcp -- --bucket my-gcp-bucket --key ./gcp-key.json\n');
    process.exit(1);
  }

  let Storage;
  try {
    const gcpStoragePkg = await import('@google-cloud/storage');
    Storage = gcpStoragePkg.Storage;
  } catch (err) {
    console.error('❌ Error: @google-cloud/storage package is not installed.');
    console.error('Run: npm install --save-dev @google-cloud/storage');
    process.exit(1);
  }

  const storageOptions = {};
  if (keyFilePath) {
    const resolvedKey = path.resolve(process.cwd(), keyFilePath);
    if (!fs.existsSync(resolvedKey)) {
      console.error(`❌ Error: Key file not found at ${resolvedKey}`);
      process.exit(1);
    }
    storageOptions.keyFilename = resolvedKey;
    console.log(`Authentication   : Using key file ${resolvedKey}`);
  } else {
    console.log('Authentication   : Using default application credentials (gcloud or ADC)');
  }

  const storage = new Storage(storageOptions);
  const bucket = storage.bucket(bucketName);

  // Check if bucket exists
  try {
    const [exists] = await bucket.exists();
    if (!exists) {
      console.error(`❌ Error: Bucket "${bucketName}" does not exist or your account has no access to it.`);
      process.exit(1);
    }
    console.log(`Target bucket    : gs://${bucketName}`);
  } catch (err) {
    console.error(`❌ Error connecting to bucket "${bucketName}":`, err.message);
    process.exit(1);
  }

  console.log('\n🚀 Starting upload...\n');
  let uploadedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < uploadQueue.length; i++) {
    const item = uploadQueue[i];
    const progress = `[${i + 1}/${uploadQueue.length}]`;
    try {
      await bucket.upload(item.file, {
        destination: item.destination,
        metadata: {
          contentType: item.contentType,
          cacheControl: 'public, max-age=31536000, immutable'
        }
      });
      console.log(`  ✅ ${progress} Uploaded: ${item.destination}`);
      uploadedCount++;
    } catch (err) {
      console.error(`  ❌ ${progress} Failed to upload ${item.destination}:`, err.message);
      failedCount++;
    }
  }

  console.log('\n' + '='.repeat(65));
  console.log(`Upload summary:`);
  console.log(`  Total files    : ${uploadQueue.length}`);
  console.log(`  Uploaded       : ${uploadedCount}`);
  console.log(`  Failed         : ${failedCount}`);
  console.log(`  Public URL base: https://storage.googleapis.com/${bucketName}`);
  console.log('='.repeat(65));
  console.log('\nNext step: update client/.env:');
  console.log(`  VITE_IMAGE_BASE_URL=https://storage.googleapis.com/${bucketName}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

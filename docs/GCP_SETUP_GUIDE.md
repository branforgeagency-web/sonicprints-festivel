# Google Cloud Storage (GCP) Setup & Upload Guide

This guide walks you through setting up a Google Cloud Storage bucket, configuring public read access, obtaining credentials, and uploading all 108 image assets from this project to GCP.

---

## Step 1: Create a Google Cloud Storage Bucket

1. Open the [Google Cloud Console - Cloud Storage](https://console.cloud.google.com/storage/browser).
2. Select your Google Cloud project (or create a new one).
3. Click **+ CREATE** at the top.
4. Fill in the bucket configuration:
   - **Name your bucket**: Choose a unique name, e.g., `sonicprints-assets` (lowercase, numbers, hyphens only).
   - **Location type**: Choose **Region** and pick a region close to your target users (e.g. `asia-south1` for Mumbai, or `asia-south2` for Delhi).
   - **Storage class**: Select **Standard** (ideal for active website images).
   - **Access control**: Choose **Uniform** (recommended for simplified permissions).
   - **Protection tools**: You can leave object versioning off unless needed.
5. Click **CREATE**.

---

## Step 2: Make Bucket Objects Publicly Readable

For a website storefront, browsers need to download images directly from the bucket without authentication tokens.

1. In the bucket details page, click the **Permissions** tab.
2. Click **GRANT ACCESS** (or **Add Principal**).
3. In **New principals**, enter:
   ```text
   allUsers
   ```
4. In **Select a role**, choose:
   ```text
   Cloud Storage > Storage Object Viewer
   ```
5. Click **SAVE**.
6. When prompted with a confirmation asking if you want to make this resource public, click **ALLOW PUBLIC ACCESS**.

> **Note**: This makes individual object URLs (e.g. `https://storage.googleapis.com/<your-bucket>/assets/img/...`) viewable by anyone, but users *cannot* list, delete, or overwrite your bucket contents.

---

## Step 3: Configure CORS (Cross-Origin Resource Sharing)

If images are loaded in `<canvas>`, through SVG `<image>`, or dynamically with fetch, CORS must allow requests from your domains:

1. In the Google Cloud Shell (or using `gcloud` locally), or create a file named `cors.json`:
   ```json
   [
     {
       "origin": ["*"],
       "method": ["GET", "HEAD"],
       "responseHeader": ["Content-Type", "Cache-Control"],
       "maxAgeSeconds": 3600
     }
   ]
   ```
2. Apply it to your bucket via Google Cloud Shell:
   ```bash
   gcloud storage buckets update gs://YOUR_BUCKET_NAME --cors-file=cors.json
   ```

---

## Step 4: Create a Service Account for Uploading

To upload files securely from the Node.js script:

1. Open [IAM & Admin > Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts).
2. Click **+ CREATE SERVICE ACCOUNT**.
3. Name it: `sonicprints-uploader` and click **CREATE AND CONTINUE**.
4. In the **Role** dropdown, select:
   ```text
   Cloud Storage > Storage Object Admin
   ```
   (This grants permission to upload, replace, and delete objects in your buckets).
5. Click **CONTINUE**, then click **DONE**.
6. Find the newly created service account in the list, click the 3 dots (⋮) on the right, and choose **Manage keys**.
7. Click **ADD KEY > Create new key**, select **JSON**, and click **CREATE**.
8. A `.json` key file will download to your computer (e.g., `sonicprints-assets-key.json`).

> ⚠️ **Security**: Never commit this JSON key file to Git! Save it in your project root or folder and ensure `.gitignore` ignores `*.json` keys (e.g. `gcp-key.json`).

---

## Step 5: Run the Upload Script

You can run the uploader in two ways:

### Method A: Command Line Flags
```bash
npm run upload:gcp -- --bucket YOUR_BUCKET_NAME --key path/to/gcp-key.json
```

### Method B: Environment Variables
Create or add to your local environment (or server `.env`):
```env
GCP_BUCKET_NAME=your-bucket-name
GCP_KEY_FILE=./gcp-key.json
```
Then simply run:
```bash
npm run upload:gcp
```

### Dry Run (Test without uploading):
```bash
npm run upload:gcp -- --dry-run
```

---

## Step 6: Configure the Frontend to Use GCP Images

Once uploaded, update `client/.env`:
```env
VITE_IMAGE_BASE_URL=https://storage.googleapis.com/YOUR_BUCKET_NAME
```

Restart your Vite dev server (`npm run client` or `npm run dev`) or re-build (`npm run build`). All images will now load from Google Cloud Storage with automated fallback to local images if `VITE_IMAGE_BASE_URL` is empty.

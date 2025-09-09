# S3 Static Site Practice

This repository contains a simple static website for practicing deployment to **AWS S3**.

## Project Files

- `index.html` – The main webpage
- `style.css` – Styling for the webpage
- `app.js` *(optional)* – JavaScript for interactivity

## How to Deploy Manually

1. **Create an S3 bucket** in AWS.
2. **Enable Static Website Hosting**:
   - Go to the bucket properties → Static website hosting → Enable.
   - Set the index document to `index.html`.
3. **Upload your files**:
   - Upload `index.html`, `style.css`, and `app.js` (if exists) to the bucket.
4. **Set bucket permissions**:
   - Go to the **Permissions** tab → Bucket Policy.
   - Add a policy to make objects publicly readable, e.g.:

```json
{
  "Version":"2012-10-17",
  "Statement":[{
    "Sid":"PublicReadGetObject",
    "Effect":"Allow",
    "Principal": "*",
    "Action":["s3:GetObject"],
    "Resource":["arn:aws:s3:::your-bucket-name/*"]
  }]
}


Access your website via the S3 bucket endpoint (provided in the Static Website Hosting section).

Optional: Deploy via GitHub Actions

You can automate deployment using GitHub Actions:

Store your AWS credentials (AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY) in GitHub Secrets.

Add a workflow file .github/workflows/deploy.yml with a job to sync the repo files to S3.

Every push to main can automatically update your S3 website.

Notes

This project is purely static (HTML, CSS, JS) with no backend.

Ensure your S3 bucket allows public access if you want the website to be accessible.

Practice GitHub Actions to deploy changes automatically.

S3 Static Site Deployment Practice

This repository contains a simple static website and two ways of deploying it to AWS S3:

Manual Upload (from AWS Console)

Automated Deployment (with GitHub Actions)

Project Files

index.html – Main webpage

style.css – Styling for the webpage

app.js (optional) – JavaScript interactivity

🚀 Method 1: Manual Deployment (AWS Console)

Create an S3 bucket in AWS.

Enable Static Website Hosting

Go to Properties → Static website hosting → Enable

Set index document = index.html

Upload files

Upload index.html, style.css, and app.js (if exists).

Set bucket policy for public access (replace your-bucket-name):

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

Access your site via the bucket’s website endpoint.

🤖 Method 2: Automated Deployment (GitHub Actions)

This repo includes a GitHub Actions workflow that deploys the site to S3 on every push to the main branch.

Setup

Create an S3 bucket (same as above).

Add these secrets in your GitHub repo:

AWS_ACCESS_KEY_ID

AWS_SECRET_ACCESS_KEY

S3_BUCKET (your bucket name)

S3_BUCKET_REGION (e.g., us-east-1)

GitHub Action workflow (.github/workflows/deploy.yml):

name: Deploy Static Site to S3

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

     name: Deploy Static Site to S3

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Upload files to S3
        run: |
          echo "Starting upload to S3..."
          aws s3 sync . s3://${{ secrets.S3_BUCKET }} \
            --delete \
            --exact-timestamps
          echo "Upload finished!"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: ${{ secrets.S3_BUCKET_REGION }}


Now, every time you push to main, GitHub will automatically sync your files with your S3 bucket.

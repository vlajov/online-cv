# Online CV - Cloud Resume Project

A serverless online resume website built with AWS cloud services that showcases both frontend design and cloud architecture skills.

## Overview

This project is a modern, cloud-native personal resume website that combines an interactive frontend with serverless backend services. The site features a clean, responsive design with interactive employment history sections and a visitor counter that tracks site traffic. Built entirely on AWS managed services, it demonstrates how to create a secure, scalable web application without managing any servers.

The architecture follows cloud best practices with separate frontend and backend components. The frontend consists of static HTML, CSS, and JavaScript files hosted in an S3 bucket and delivered through CloudFront for optimal performance. The backend uses Lambda functions and DynamoDB to track visitor statistics, with security measures to protect against abuse.

Deployment is fully automated through a CI/CD pipeline built with GitHub Actions. When changes are pushed to the main branch, the workflow authenticates to AWS using OIDC (avoiding long-term credentials) and deploys the updated files to S3.

## Technologies

The project leverages several AWS services working together:

- **Frontend Hosting**: Amazon S3, CloudFront, Route53, ACM
- **Backend Services**: AWS Lambda, DynamoDB
- **Development & Deployment**: GitHub Actions with OIDC authentication

The frontend is built with standard web technologies (HTML5, CSS3, JavaScript) with a focus on accessibility and responsive design. Security is implemented at multiple levels through proper CORS configuration, origin validation, and rate limiting.

## Project Structure

```
.
├── .github/workflows/  # CI/CD pipeline configuration
├── website/            # Frontend static website files
├── README.md           # Project documentation
└── lambda_function.py  # Download Notification Lambda Function
```

```
                                  +----------------+
                                  |                |
                                  |   GitHub       |
                                  |   Repository   |
                                  |                |
                                  +-------+--------+
                                          |
                                          | Push to main branch
                                          |
                                  +-------v--------+
                                  |                |
                                  |   GitHub       |
                                  |   Actions      |
                                  |   CI/CD        |
                                  |                |
                                  +-------+--------+
                                          |
                                          | AWS OIDC Authentication
                                          | S3 Sync
                                          |
+----------------+                +-------v--------+
|                |                |                |
|   Route 53     +--------------->+   S3 Bucket    |
|   DNS          |                |   (Website)    |
|                |                |                |
+-------+--------+                +-------+--------+
        ^                                 |
        |                                 | Origin
        |                                 |
+-------+--------+                +-------v--------+
|                |                |                |
|   ACM          +<---------------+   CloudFront   |
|   Certificate  |                |   CDN          |
|                |                |                |
+----------------+                +----------------+
                                          ^
                                          |
                                          | API Calls
                                          |
                          +---------------+---------------+
                          |                               |
            +-------------v-----------+     +-------------v-----------+
            |                         |     |                         |
            |   API Gateway           |     |   Lambda Function       |
            |   (Visitor Counter)     +---->+   (Download             |
            |                         |     |    Notification)        |
            +-------------+-----------+     +-------------+-----------+
                          |                               |
                          |                               |
                          v                               v
                  +-------+-------+               +-------+-------+
                  |               |               |               |
                  |   DynamoDB    |               |   SES         |
                  |   (Counter)   |               |   (Email)     |
                  |               |               |               |
                  +---------------+               +---------------+
```

## Inspiration

This project was inspired by Forrest Brazeal's Cloud Resume Challenge, with additional features and security enhancements to create a more robust and production-ready implementation.
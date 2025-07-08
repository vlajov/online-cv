# Resume Download Notification Lambda Function

This Lambda function sends an email notification when someone downloads your resume. It includes security features like rate limiting and origin validation.

## Setup Instructions


### 1. Create Lambda Function

1. Create a new Lambda function running latest Python
2. Copy the below code into your Lambda function:
```python
import json
import os
import boto3
import time
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    # Get recipient email from environment variable
    recipient_email = os.environ.get('EMAIL_ADDRESS', 'your-email@example.com')
    sender_email = 'noreply@yourdomain.com'
    
    # Get IP and referer if available
    source_ip = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')
    referer = event.get('headers', {}).get('referer', 'unknown')
    
    # Create email content
    subject = 'Resume Download Notification'
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())
    
    # Simple HTML message
    html_message = f'''
    <html>
    <body style="font-family: Arial, sans-serif;">
        <h2>Resume Download Notification</h2>
        <p>Someone has downloaded your resume.</p>
        <p>Time: {timestamp}<br>
        IP: {source_ip}<br>
        Referrer: {referer}</p>
    </body>
    </html>
    '''
    
    # Plain text version
    text_message = f"Resume Download Notification\n\nSomeone has downloaded your resume.\n\nTime: {timestamp}\nIP: {source_ip}\nReferrer: {referer}"

    try:
        # Send email using SES
        ses = boto3.client('ses', region_name='us-east-1')
        response = ses.send_email(
            Source=f'"Resume Notification" <{sender_email}>',
            Destination={'ToAddresses': [recipient_email]},
            Message={
                'Subject': {'Data': subject},
                'Body': {
                    'Text': {'Data': text_message},
                    'Html': {'Data': html_message}
                }
            }
        )
        
        # Return success response
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Notification sent'})
        }
        
    except Exception as e:
        # Return error response
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
```
3. Add environment variable by going to Configuration tab then Environment variables:
   - Key: `EMAIL_ADDRESS`
   - Value: Your email address where notifications will be sent
4. Replace `'noreply@yourdomain.com'` with your verified SES email or domain

### 2. Configure Lambda Permissions

1. Add permissions for SES (to send emails) and DynamoDB (for rate limiting)
2. Create a policy with these permissions and attach it to your Lambda's execution role:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        }
    ]
}
```

### 3. Create Function URL

1. In your Lambda function configuration, go to "Function URL"
2. Click "Create function URL"
3. Set Auth type to "NONE"
4. Configure CORS:
   - Allow origins: Your website domain (e.g., `https://yourdomain.com`)
   - Allow methods: POST
   - Allow headers: content-type
5. Click "Save"

### 4. Update Website Code

Make sure your website's JavaScript code is pointing to your Lambda function URL.

## Security Features

1. **Enhanced Logging**: Includes IP address and timestamp in notifications

## Customization

- Customize the email subject and message as needed
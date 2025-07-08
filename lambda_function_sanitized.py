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
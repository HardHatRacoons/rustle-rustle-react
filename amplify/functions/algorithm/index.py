import boto3
import os
from datetime import datetime

s3_client = boto3.client('s3')

def handler(event, context):
    file_key = f"annotated/{datetime.now().isoformat()}.pdf"

    s3_client.put_object(
        Bucket=os.getenv('raccoonTeamDrive_BUCKET_NAME'),
        Key=file_key,
        Body="",
        ContentType="application/pdf"
    )

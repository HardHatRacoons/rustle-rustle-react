import boto3
import pymupdf
from io import BytesIO

import utils

s3_client = boto3.client('s3')

def handler(event, context):
    for record in event['Records']:
        bucket_name = record['s3']['bucket']['name']
        original_key = record['s3']['object']['key']
        file_key = f"annotated/{original_key.split('/')[1]}/{original_key.split('/')[-1]}"

        response = s3_client.get_object(Bucket=bucket_name, Key=original_key)
        metadata = response.get('Metadata', {})

        annoated, csv = utils.sacred_algo(BytesIO(response['Body'].read()))

        s3_client.put_object(
            Bucket=bucket_name, # pull from environment variable
            Key=file_key,
            Body=annoated,
            ContentType="application/pdf",
            Metadata=metadata,
        )
        s3_client.put_object(
            Bucket=bucket_name, # pull from environment variable
            Key=f"{file_key.split('.')[0]}.csv",
            Body=csv,
            ContentType="text/csv",
            Metadata=metadata,
        )

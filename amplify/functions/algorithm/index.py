import boto3

s3_client = boto3.client('s3')

def handler(event, context):
    for record in event['Records']:
        original_key = record['s3']['object']['key']
        file_key = f"annotated/{original_key.split('/')[1]}/{original_key.split('/')[-1]}"

        s3_client.put_object(
            Bucket=record['s3']['bucket']['name'], # pull from environment variable
            Key=file_key,
            Body="",
            ContentType="application/pdf"
        )

import boto3

s3_client = boto3.client('s3')

def handler(event, context):
    for record in event['Records']:
        bucket_name = record['s3']['bucket']['name']
        original_key = record['s3']['object']['key']
        file_key = f"annotated/{original_key.split('/')[1]}/{original_key.split('/')[-1]}"

        response = s3_client.get_object(Bucket=bucket_name, Key=original_key)
        # original_content = response['Body'].read()
        metadata = response.get('Metadata', {})

        s3_client.put_object(
            Bucket=bucket_name, # pull from environment variable
            Key=file_key,
            Body="",
            ContentType="application/pdf",
            Metadata=metadata,
        )

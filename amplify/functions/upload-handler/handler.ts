import { env } from '$amplify/env/upload-handler'; // the import is '$amplify/env/<function-name>'
import type { S3Handler } from 'aws-lambda';

export const handler: S3Handler = async (event) => {
    const objectKeys = event.Records.map((record) => record.s3.object.key);
    objectKeys.forEach(async key => {
        let [, user_id, file_id] = key.split('/')
        let request = new Request(`${env.API_ENDPOINT}/api/v1/pdf-proccessing/request`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'X-API-KEY': env.API_KEY
            }),
            body: JSON.stringify({
                user_id: user_id,
                file_id: file_id.split('.').slice(0, -1).join('.'),
                bucket_name: env.RACCOON_TEAM_DRIVE_BUCKET_NAME
            })
        })

        await fetch(request)
    })
};
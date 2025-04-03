import { EventType } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { storage } from './storage/resource';
import { uploadHandler } from './functions/upload-handler/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
    auth,
    storage,
    uploadHandler,
});

backend.storage.resources.bucket.addEventNotification(
    EventType.OBJECT_CREATED_PUT,
    new LambdaDestination(backend.uploadHandler.resources.lambda),
    {
        prefix: 'unannotated/',
        suffix: '.pdf',
    },
);

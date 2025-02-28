import { EventType } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { algorithmHandler } from './functions/algorithm/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
    auth,
    data,
    storage,
    algorithmHandler,
});

backend.storage.resources.bucket.addEventNotification(
    EventType.OBJECT_CREATED_PUT,
    new LambdaDestination(backend.algorithmHandler.resources.lambda),
    {
        prefix: 'unannotated/',
        suffix: '.pdf',
    },
);

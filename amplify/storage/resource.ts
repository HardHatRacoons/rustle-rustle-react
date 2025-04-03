import { defineStorage } from '@aws-amplify/backend';
import { uploadHandler } from '../functions/upload-handler/resource';

export const storage = defineStorage({
    name: 'raccoonTeamDrive',
    access: (allow) => ({
        'annotated/*': [
            allow.authenticated.to(['read', 'write', 'delete']), // additional actions such as "write" and "delete" can be specified depending on your use case
        ],
        'unannotated/*': [
            allow.authenticated.to(['read', 'write', 'delete']),
            allow.resource(uploadHandler).to(['read']),
        ],
    }),
});

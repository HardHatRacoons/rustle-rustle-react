import { defineStorage } from '@aws-amplify/backend';
import { algorithmHandler } from '../functions/algorithm/resource';

export const storage = defineStorage({
    name: 'raccoonTeamDrive',
    access: (allow) => ({
        'annotated/*': [
            allow.authenticated.to(['read', 'delete']), // additional actions such as "write" and "delete" can be specified depending on your use case
            allow.resource(algorithmHandler).to(['read', 'write']),
        ],
        'unannotated/*': [
            allow.authenticated.to(['read', 'write', 'delete']),
            allow.resource(algorithmHandler).to(['read']),
        ],
    }),
});

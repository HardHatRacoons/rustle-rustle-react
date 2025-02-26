import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'raccoonTeamDrive',
    access: (allow) => ({
        'annotated/*': [
            allow.guest.to(['read']), // additional actions such as "write" and "delete" can be specified depending on your use case
        ],
        'unannotated/*': [allow.guest.to(['read', 'write'])],
    }),
});

import { defineFunction, secret } from '@aws-amplify/backend';

export const uploadHandler = defineFunction({
    name: 'upload-handler',
    entry: './handler.ts',
    timeoutSeconds: 60,
    environment: {
        API_ENDPOINT: 'https://www.hardhatraccoons-api.site',
        API_KEY: secret('API_KEY')
    },
    resourceGroupName: 'storage',
})
require('dotenv').config();
import * as AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION
});

const secretName = "aws-secrets-moviedb";
const regionName = "eu-north-1";

const client = new AWS.SecretsManager({region: regionName});

export const getSecrets = async () => {
    try {
        // Calling SecretsManager
        const getSecretValueResponse = await client.getSecretValue({SecretId: secretName}).promise();

        // Extracting the key/value from the secret
        const secret = JSON.parse(<string>getSecretValueResponse.SecretString);

        return {
            username: secret.MOVIEDB_USERNAME,
            password: secret.MOVIEDB_PASSWORD,
            moviedb_access_token: secret.MOVIEDB_ACCESS_TOKEN,
        };
    } catch (error) {
        console.error('Error retrieving secret:', error);
        throw error;
    }
};

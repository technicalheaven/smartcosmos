const MicrosoftGraph = require('@microsoft/microsoft-graph-client');
import MyAuthenticationProvider from './authProvider'
require('isomorphic-fetch');
import { logger } from '../../../libs/logger/index';
import { config } from '../../../config';

const clientOptions:any = {
	authProvider: new MyAuthenticationProvider(),
};

const client = MicrosoftGraph.Client.initWithMiddleware(clientOptions);

async function createUser(user: any) {
    try {
        logger.info('Graph API called at: ' + new Date().toString());
        return Promise.resolve(await client.api('/users').post(user));
    } catch (error) {
        return Promise.reject(error);
    }
}

async function getExtensionAttributes(username:any) {
    try {
        logger.info('Graph API called at: ' + new Date().toString());
        return Promise.resolve(await client.api(`/users/${username}@${config.DOMAIN}?$select=${config.extension_tenantId},${config.extension_userId}`).get());
    } catch (error) {
        return Promise.reject(error);
    }
}

async function updateUser(username: any, prop: any) {
    try {
        logger.info('Graph API called at: ' + new Date().toString());
        return Promise.resolve(await client.api(`/users/${username}@${config.DOMAIN}`).patch(prop));
    } catch (error) {
        return Promise.reject(error);
    }
}

async function invalidateAllRefreshTokens(username: any) {
    try {
        logger.info('Graph API called at: ' + new Date().toString());
        return Promise.resolve(await client.api(`/users/${username}@${config.DOMAIN}/invalidateAllRefreshTokens`).version('beta').post());
    } catch (error) {
        return Promise.reject(error);
    }
}

// async function getUsers() {
//     try {
//         logger.info('Graph API called at: ' + new Date().toString());
//         return await client.api('/users').get();
//     } catch (error) {
//         return Promise.reject(error);
//     }
// }

// async function getUser(id) {
//     try {
//         logger.info('Graph API called at: ' + new Date().toString());
//         return await client.api(`/users/${id}`).get();
//     } catch (error) {
//         return Promise.reject(error);
//     }
// }

async function deleteUser(username: any) {
    try {
        logger.info('Graph API called at: ' + new Date().toString());
        return Promise.resolve(await client.api(`/users/${username}@${config.DOMAIN}`).delete());
    } catch (error) {
        return Promise.reject(error);
    }
}

// async function createUsersFromFile(path) {
//     let users = JSON.parse(fs.readFileSync(path));

//     try {
//         logger.info('Graph API called at: ' + new Date().toString());
//         return await users.forEach(async(user) => {
//             return await client.api('/users').post(user);
//         });
//     } catch (error) {
//         return Promise.reject(error);
//     }
// }

export { createUser,getExtensionAttributes,updateUser,invalidateAllRefreshTokens,deleteUser }
import { config } from "../../../config";

const msal = require('@azure/msal-node');

const msalConfig = {
    auth: {
        clientId: config.CLIENT_ID,
        authority: config.authority,
        clientSecret: config.CLIENT_SECRET,
   } 
};

const tokenRequest = {
    scopes: [ process.env.scope! ],
};

// Create msal application object
const cca = new msal.ConfidentialClientApplication(msalConfig);

class MyAuthenticationProvider {

	/**
	 * This method will get called before every request to the msgraph server
	 * This should return a Promise that resolves to an accessToken (in case of success) or rejects with error (in case of failure)
	 * Basically this method will contain the implementation for getting and refreshing accessTokens
	 */
    
	async getAccessToken() {
        return new Promise(async(resolve, reject) => {
            const authResponse = await cca.acquireTokenByClientCredential(tokenRequest)
            
            if (authResponse?.accessToken && authResponse.accessToken.length !== 0) {
              resolve(authResponse.accessToken);
            } else {
              reject(Error('Error: cannot obtain access token.'));
            }
          });
    }
}

export default MyAuthenticationProvider;
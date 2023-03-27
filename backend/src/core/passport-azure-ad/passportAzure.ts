import { logger } from '../../libs/logger';


var config1 = require('./config');
var passport = require('passport');
var OIDCBearerStrategy = require('passport-azure-ad').BearerStrategy;

var options = {
    // The URL of the metadata document for your app. We will put the keys for token validation from the URL found in the jwks_uri tag of the in the metadata.
    identityMetadata: config1.creds.identityMetadata,
    clientID: config1.creds.clientID,
    validateIssuer: config1.creds.validateIssuer,
    issuer: config1.creds.issuer,
    passReqToCallback: config1.creds.passReqToCallback,
    isB2C: config1.creds.isB2C,
    policyName: config1.creds.policyName,
    allowMultiAudiencesInToken: config1.creds.allowMultiAudiencesInToken,
    audience: config1.creds.audience,
    loggingLevel: config1.creds.loggingLevel,
};

export const passportAzure = (app: any) => {
    // Let's start using Passport.js

    app.use(passport.initialize()); // Starts passport
    // app.use(passport.session()); // Provides session support

    var bearerStrategy = new OIDCBearerStrategy(options,
        function (token: any, done: any) {
            logger.info(token, 'was the token retreived');
            // if (!token.oid)
            //     done(new Error('oid is not found in token'));
            // else {
            // owner = token.oid;
            done(null, token);
            // }
        }
    );

    passport.use(bearerStrategy);
}
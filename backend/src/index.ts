import http from 'http'
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { initDB, models, runMirgrationSeederMYSQL } from "./config/db";
import { tenantRoutes } from './modules/tenant/routes'
import { userRoutes } from './modules/user/routes'
import { siteRoutes } from './modules/site/routes'
import { zoneRoutes } from './modules/zone/routes';
import { deviceRoutes } from './modules/device/routes';
import { reportRoutes } from './modules/report/routes';
import { ProcessRoutes } from './modules/process/routes/process';
import { logger } from './libs/logger/index';
import { productRoutes } from './modules/product/routes';
import cors from 'cors';
import mongoDatabaseInstance from './config/mongoDB';
import { tagRoutes } from './modules/tag/routes';
import { config } from './config';
import { passportAzure } from './core/passport-azure-ad/passportAzure';
import { intializeSyncService } from './modules/device/sync-service/services/sync';
import { SecureAuthRoutes } from './modules/secure-authentication/routes/index'

var passport = require('passport');
dotenv.config();
// Initialize Express
const app: Express = express();
const port = process.env.PORT;
// Apply middlewares
app.use((cors()))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// for passport-azure-ad
passportAzure(app)
app.get(`${config.API_PREFIX}/passport`, passport.authenticate('oauth-bearer', { session: false }), (req: Request, res: Response) => {
  res.send('ok')
});
tenantRoutes({ app, models, logger });
userRoutes({ app, models, logger });
siteRoutes({ app, models, logger });
productRoutes({ app, models, logger, });
zoneRoutes({ app, models, logger });
tagRoutes({ app });
ProcessRoutes({ app, models, logger });
deviceRoutes({ app, models, logger });
reportRoutes({ app, models, logger });
SecureAuthRoutes({ app, models, logger });
// app.listen(port, () => {
//   console.log(`⚡️[server]: Server is running at ${config.SERVER_HTTPS ? 'https' : 'http'}://localhost:${port}`);
// });  
app.get('/', (req, res) => {
  res.send(`Server Running on port : ${port}`)
})
// Create the HTTP Express Server
const server = http.createServer(app);
// Initialize sequelize connection
initDB().then(async (res: any) => {
  console.log('after connection..');
  await runMirgrationSeederMYSQL()
  intializeSyncService(server)
});

dbConnect();
async function dbConnect() {
  var dbStat = await mongoDatabaseInstance
  if (dbStat) {
    logger.info("MongoDB Connection Successful!")
  }
  else {
    logger.error("MongoDB not connected")
  }
}
// //initilaize websocket server for sync service
server.listen(port, () => {
  logger.info('listening on ', port);
});

import mongoose from "mongoose";
import { logger } from "../libs/logger";

class MongoConnect {
    mongoDb: any
    constructor(){
        try {
            let connectionURL = null
            let connectionURLTest = null
            if(process.env.COSMOSDB_HOST && process.env.IS_COSMOSDB == 'true'){
                     connectionURL = 'mongodb://'+process.env.COSMOSDB_USER+':'+process.env.COSMOSDB_PASSWORD+'@'+process.env.COSMOSDB_HOST+':'+process.env.COSMOSDB_PORT+'/'+process.env.COSMOSDB_DBNAME+'?ssl=true&retryWrites=true'
            }
            if(process.env.NODE_ENV == 'test'){
                this.mongoDb = mongoose.connect(connectionURLTest || 'mongodb://127.0.0.1:27017/smartcosmos_test?authSource=admin' , {retryWrites: false});
            }else{
                
                   this.mongoDb = mongoose.connect(connectionURL || 'mongodb://127.0.0.1:27017/smartcosmos?authSource=admin' , {    
                    retryWrites: false
                });
            }
            //logger.debug("Connection URL",connectionURL);
            //logger.debug("Connection URL",this.mongoDb);
            mongoose.connection
                .once("open", () => {
                    // mongoose.connection.db.listCollections({ name: process.env.MONGODB_COLLECTION || "biometricData" })
                    //     .next(function (err: any, result: any) {
                    //         if (!result) {
                    //             console.log('yup');
                    //             mongoose.connection.db.createCollection(process.env.MONGODB_COLLECTION || "biometricData", {
                    //                 autoIndexId: true
                    //             })
                    //         }
                    //     });
                     logger.info("Connected to db!")
                }) //Event Listeners
                .on("error", (error: any) => {
                    logger.error("error while connecting to mongodb",error);
                });
        } catch (error: any) {
            logger.error(`\n\n\nSomething went wrong while connecting with MongoDB\n\n\n`);
            logger.error('\n\n\n');
        } 
    }
}

let mongoDatabaseInstance = new MongoConnect().mongoDb
export default mongoDatabaseInstance

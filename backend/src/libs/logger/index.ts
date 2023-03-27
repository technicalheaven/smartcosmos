import bunyan from 'bunyan'
import bformat from 'bunyan-format'
import RotatingFileStream from 'bunyan-rotating-file-stream';
import fs from 'fs';
const formatOut = bformat({ outputMode: 'short'});


// var dir = './src/logs';
// if (!fs.existsSync(dir)){
//     fs.mkdirSync(dir);
// }

const bunyanOpts:any = {
    name: 'smartcosmos-logs',
    src: true,
    streams: [
        {
            level: 'trace',
            stream: formatOut       // log TRACE and above to stdout
        },
        {
            level: 'trace',
            stream: new RotatingFileStream({
                path: 'src/logs/%d-%b-%y.log',
                period: '1d',          // daily rotation
                rotateExisting: true,  // Give ourselves a clean file when we start up, based on period
                threshold: '2m',      // Rotate log files larger than 10 megabytes
                totalSize: '20m',      // Don't keep more than 20mb of archived log files
                gzip: true,             // Compress the archive log files to save space

            })
        }
    ]

};



export var logger = bunyan.createLogger(bunyanOpts);
